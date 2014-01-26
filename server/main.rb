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
  MAX_PLAYERS = 5

  attr_reader :players

  def initialize(players)
    @players = []
    players.each do |p|
      add_player p
    end

    $games[:with_slots] << self
  end

  def handle_message(player, message)
    @players.each do |p|
      next if p == player
      p.socket.send message
    end
  end

  def add_player(player)
    LOG.debug "Adding player #{player.id}"
    player.socket.send JSON.generate({type: "GameStarting"})

    player.socket.onmessage { |m| handle_message(player, m) }
    player.socket.onclose { remove_player(player) }

    @players << player

    if @players.length == MAX_PLAYERS
      $games[:with_slots].delete self
      $games[:full] << self
    end
  end

  def remove_player(player)
    old_player_count = @players.length

    return unless @players.delete player

    player.socket.close

    @players.each do |p|
      p.socket.send JSON.generate({
        type: "PlayerLeft",
        playerId: player.id
      })
    end

    if @players.length == 0
      $games[:with_slots].delete self
    elsif old_player_count == MAX_PLAYERS and @players.length < MAX_PLAYERS
        $games[:full].delete self
        $games[:with_slots] << self
    end
  end
end

$games = {
  full: [],
  with_slots: []
}

waitingPlayer = nil;

LOG.debug "FSK Server starting up..."

EM.run do
  EM::WebSocket.start(host: "0.0.0.0", port: 8080) do |socket|

    socket.onopen do
      LOG.debug("Client #{socket.object_id} connected")

      player = Player.new(socket)
      socket.send JSON.generate({
        type: "RegistrationSuccessful",
        id: player.id,
      })

      if $games[:with_slots].any?
        LOG.debug "found game with slot, adding player"
        $games[:with_slots][0].add_player(player)
      elsif waitingPlayer
        LOG.debug "got someone waiting already, starting game"
        $games[:with_slots] << Game.new([waitingPlayer, player]);
        waitingPlayer = nil
      else
        LOG.debug "queuing player waiting for the next one"
        waitingPlayer = player
      end
    end

    socket.onmessage do |message_json|
      LOG.debug("Got message: \"#{message_json}\"")
      socket.send({type: "GameNotRunning"})
    end

    socket.onclose do
      if waitingPlayer && waitingPlayer.socket.object_id == socket.object_id
        waitingPlayer = nil
      end
    end
  end
end

