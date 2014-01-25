#!/usr/bin/env ruby
require 'eventmachine'
require 'em-websocket'
require 'json'
require 'logger'

LOG = Logger.new STDOUT

class Player
  attr_reader :socket, :id

  def initialize(socket)
    @socket = socket
    @id = SecureRandom.uuid
  end
end

class Game
  attr_reader :players

  def initialize(players)
    @players = players
    @players.each do |p|
      LOG.debug("sending #{JSON.generate({type: "GameStarting"})}")
      p.socket.send JSON.generate({type: "GameStarting"})
    end
  end

  def contains_player_with_socket_id(sockid)
    players.any? {|p| p.socket.object_id == sockid}
  end

  def handleMessage(sockid, message)
    players.each do |p|
      next if p.socket.object_id == sockid
      p.socket.send JSON.generate(message)
    end
  end

  def abort
    players.each do |p|
      p.socket.send JSON.generate({type: "GameAborted"})
    end
  end
end

class PlayerPool
  def initialize
    @players_by_socket_id = {}
  end

  def <<(player)
    send_players_waiting_update(@players_by_socket_id.length + 1)
    @players_by_socket_id[player.socket.object_id] = player
  end

  def has_socket_id(sockid)
    @players_by_socket_id.has_key? sockid
  end

  def playercount
    @players_by_socket_id.length
  end

  def players
    @players_by_socket_id.values
  end

  def clear
    @players_by_socket_id.clear
  end

  def delete_by_socket_id(sockid)
    @players_by_socket_id.delete(sockid)
    send_players_waiting_update(@players_by_socket_id.length)
  end

private
  def send_players_waiting_update(playercount)
    @players_by_socket_id.each_value do |p|
      LOG.debug("sending playerswaitingupdate to #{p.id}")
      p.socket.send JSON.generate({
        type: "PlayersWaitingUpdate",
        currentPlayersWaiting: playercount
      })
    end
  end
end

waitingpool = PlayerPool.new

game = nil
LOG.debug "FSK Server starting up..."

EM.run do
  EM::WebSocket.start(host: "0.0.0.0", port: 8080) do |socket|

    socket.onopen do
      LOG.debug("Client #{socket.object_id} connected")

      if game
        socket.send JSON.generate({type: "GameAlreadyRunning"})
        socket.close
      elsif waitingpool.has_socket_id(socket.object_id)
        socket.send JSON.generate({type: "AlreadyRegistered"})
      else
        player = Player.new(socket)
        waitingpool << player
        socket.send JSON.generate({
          type: "RegistrationSuccessful",
          id: player.id,
          currentPlayersWaiting: waitingpool.playercount
        })
        LOG.debug("Assigning id #{player.id}")
      end
    end

    socket.onmessage do |message_json|
      LOG.debug("Got message: \"#{message_json}\"")
      message = JSON.parse(message_json)
      if message["type"] == "StartGame"
        if game
          socket.send({type: "GameAlreadyRunning"})
        elsif waitingpool.playercount < 2
          socket.send({type: "NotEnoughPlayers"})
        else
          game = Game.new(waitingpool.players)
          waitingpool.clear
        end
      elsif not game
        socket.send({type: "GameNotRunning"})
      else
        game.handleMessage(socket.object_id, message)
      end
    end

    socket.onclose do
      game.abort if game and game.contains_player_with_socket_id(socket.object_id)
      game = nil

      waitingpool.delete_by_socket_id(socket.object_id)
    end
  end
end

