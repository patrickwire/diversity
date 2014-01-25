#!/usr/bin/env ruby
require 'eventmachine'
require 'em-websocket'
require 'json'

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
    #startthegame
  end

  def contains_player_with_socket_id(sockid)
    players.any? {|p| p.socket.object_id == sockid}
  end

  def handleMessage(sockid, message)
    players.reject {|p| p.socket.object_id == sockid}.each do |p|
      p.socket.send Json.generate(message)
    end
  end

  def abort
    players.each do |p|
      p.socket.send JSON.generate({type: "GameAborted"})
    end
  end
end

waiting_players_by_socket_id = {}

game = nil

EM.run do
  EM::WebSocket.start(host: "0.0.0.0", port: 8080) do |socket|

    socket.onopen do
      if game
        socket.send JSON.generate({type: "GameAlreadyRunning"})
        socket.close
      elsif waiting_players_by_socket_id[socket.object_id]
        socket.send JSON.generate({type: "AlreadyRegistered"})
      else
        player = Player.new(socket)
        waiting_players_by_socket_id[socket.object_id] = player
        socket.send JSON.generate({type: "WaitingForPlayers", id: player.id})
      end
    end

    socket.onmessage do |message_json|
      message = JSON.parse(message_json)
      if message.type == "StartGame"
        if game
          socket.send({type: "GameAlreadyRunning"})
        elsif waiting_players_by_socket_id.length < 2
          socket.send({type: "NotEnoughPlayers"})
        else
          game = Game.new(waiting_players_by_socket_id.values)
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

      waiting_players_by_socket_id.delete(socket.object_id)
    end
  end
end
