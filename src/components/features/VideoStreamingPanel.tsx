'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Video,
  VideoOff,
  PhoneOff,
  Phone,
  Loader2,
  Users,
  Clock,
  Wifi,
  WifiOff,
  MonitorPlay,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  getStreamingByBooking,
  joinStreamingRoom,
  leaveStreamingRoom,
  endStreaming,
} from '@/lib/api/streaming';
import type { Streaming } from '@/types';

type VideoStreamingPanelProps = {
  bookingId: string;
  role: 'customer' | 'pg';
  onEnd?: () => void;
};

type RoomStatus = 'loading' | 'not_created' | 'waiting_to_join' | 'joining' | 'connected' | 'waiting_for_other' | 'ended';

export function VideoStreamingPanel({ bookingId, role, onEnd }: VideoStreamingPanelProps) {
  const [streaming, setStreaming] = useState<Streaming | null>(null);
  const [roomStatus, setRoomStatus] = useState<RoomStatus>('loading');
  const [elapsedTime, setElapsedTime] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [ending, setEnding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchStreamingInfo = useCallback(async () => {
    try {
      const response = await getStreamingByBooking(bookingId);
      const data = response.data;
      if ((data?.success || data?.status) && data.data) {
        const info: Streaming = data.data;
        setStreaming(info);

        if (info.isEnded) {
          setRoomStatus('ended');
        } else if (info.isCustomerJoined && info.isPanthulugaruJoined) {
          setRoomStatus('connected');
        } else if (
          (role === 'customer' && info.isCustomerJoined) ||
          (role === 'pg' && info.isPanthulugaruJoined)
        ) {
          setRoomStatus('waiting_for_other');
        } else {
          setRoomStatus('waiting_to_join');
        }
      } else {
        setRoomStatus('not_created');
      }
    } catch {
      setRoomStatus('not_created');
    }
  }, [bookingId, role]);

  useEffect(() => {
    fetchStreamingInfo();
    const pollInterval = setInterval(fetchStreamingInfo, 5000);
    return () => clearInterval(pollInterval);
  }, [fetchStreamingInfo]);

  // Timer for ceremony duration
  useEffect(() => {
    if (roomStatus === 'connected' || roomStatus === 'waiting_for_other') {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [roomStatus]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleJoin = async () => {
    setRoomStatus('joining');
    try {
      const response = await joinStreamingRoom(bookingId, role);
      const data = response.data;
      if (data?.success || data?.status) {
        toast.success('Joined the ceremony room');
        fetchStreamingInfo();
      } else {
        toast.error(data?.message || 'Failed to join');
        setRoomStatus('waiting_to_join');
      }
    } catch {
      toast.error('Failed to join the ceremony');
      setRoomStatus('waiting_to_join');
    }
  };

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await leaveStreamingRoom(bookingId);
      toast.success('Left the ceremony room');
      setRoomStatus('waiting_to_join');
      setElapsedTime(0);
      fetchStreamingInfo();
    } catch {
      toast.error('Failed to leave the room');
    } finally {
      setLeaving(false);
    }
  };

  const handleEnd = async () => {
    if (!confirm('Are you sure you want to end this ceremony? This action cannot be undone.')) {
      return;
    }
    setEnding(true);
    try {
      await endStreaming(bookingId);
      toast.success('Ceremony ended');
      setRoomStatus('ended');
      onEnd?.();
    } catch {
      toast.error('Failed to end the ceremony');
    } finally {
      setEnding(false);
    }
  };

  const getStatusConfig = () => {
    switch (roomStatus) {
      case 'loading':
        return { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Loading...', icon: Loader2 };
      case 'not_created':
        return { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Room not created', icon: VideoOff };
      case 'waiting_to_join':
        return { color: 'text-[#FF6B00]', bg: 'bg-[#FF6B00]/10', label: 'Ready to join', icon: Video };
      case 'joining':
        return { color: 'text-blue-500', bg: 'bg-blue-100', label: 'Joining...', icon: Loader2 };
      case 'connected':
        return { color: 'text-green-500', bg: 'bg-green-100', label: 'Connected', icon: Wifi };
      case 'waiting_for_other':
        return {
          color: 'text-yellow-600',
          bg: 'bg-yellow-100',
          label: `Waiting for ${role === 'customer' ? 'Panthulugaru' : 'Customer'}...`,
          icon: Users,
        };
      case 'ended':
        return { color: 'text-red-500', bg: 'bg-red-100', label: 'Ceremony ended', icon: WifiOff };
      default:
        return { color: 'text-gray-500', bg: 'bg-gray-100', label: 'Unknown', icon: VideoOff };
    }
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
      {/* Video area placeholder */}
      <div className="relative aspect-video bg-gray-900 flex items-center justify-center">
        {roomStatus === 'connected' || roomStatus === 'waiting_for_other' ? (
          <div className="text-center">
            <MonitorPlay className="h-16 w-16 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">
              {roomStatus === 'connected'
                ? 'Video stream active'
                : `Waiting for ${role === 'customer' ? 'Panthulugaru' : 'Customer'} to join...`}
            </p>
            <p className="text-gray-500 text-xs mt-1">
              WebRTC integration will be activated upon deployment
            </p>
          </div>
        ) : roomStatus === 'ended' ? (
          <div className="text-center">
            <VideoOff className="h-16 w-16 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400">Ceremony has ended</p>
          </div>
        ) : roomStatus === 'loading' || roomStatus === 'joining' ? (
          <Loader2 className="h-10 w-10 text-gray-500 animate-spin" />
        ) : (
          <div className="text-center">
            <Video className="h-16 w-16 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">Join the ceremony to start streaming</p>
          </div>
        )}

        {/* Status badge overlay */}
        <div className="absolute top-4 left-4">
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.color}`}>
            <StatusIcon className={`h-3.5 w-3.5 ${roomStatus === 'loading' || roomStatus === 'joining' ? 'animate-spin' : ''}`} />
            {statusConfig.label}
          </div>
        </div>

        {/* Timer overlay */}
        {(roomStatus === 'connected' || roomStatus === 'waiting_for_other') && (
          <div className="absolute top-4 right-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs font-mono">
              <Clock className="h-3.5 w-3.5" />
              {formatTime(elapsedTime)}
            </div>
          </div>
        )}

        {/* Participants overlay */}
        {streaming && (roomStatus === 'connected' || roomStatus === 'waiting_for_other') && (
          <div className="absolute bottom-4 left-4 flex gap-2">
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${streaming.isPanthulugaruJoined ? 'bg-green-500/90 text-white' : 'bg-gray-700/70 text-gray-300'}`}>
              <div className={`h-2 w-2 rounded-full ${streaming.isPanthulugaruJoined ? 'bg-white' : 'bg-gray-500'}`} />
              Panthulugaru
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${streaming.isCustomerJoined ? 'bg-green-500/90 text-white' : 'bg-gray-700/70 text-gray-300'}`}>
              <div className={`h-2 w-2 rounded-full ${streaming.isCustomerJoined ? 'bg-white' : 'bg-gray-500'}`} />
              Customer
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500">
            {streaming && (
              <span>Room: <span className="font-medium text-gray-700">{streaming.roomName}</span></span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {roomStatus === 'waiting_to_join' && (
              <Button variant="primary" onClick={handleJoin}>
                <Phone className="h-4 w-4 mr-1.5" />
                Join Ceremony
              </Button>
            )}

            {roomStatus === 'joining' && (
              <Button variant="primary" isLoading>
                Joining...
              </Button>
            )}

            {(roomStatus === 'connected' || roomStatus === 'waiting_for_other') && (
              <>
                <Button
                  variant="outline"
                  onClick={handleLeave}
                  isLoading={leaving}
                >
                  <PhoneOff className="h-4 w-4 mr-1.5" />
                  Leave Room
                </Button>
                {role === 'pg' && (
                  <Button
                    variant="secondary"
                    onClick={handleEnd}
                    isLoading={ending}
                  >
                    End Ceremony
                  </Button>
                )}
              </>
            )}

            {roomStatus === 'not_created' && (
              <Badge variant="default">Room not yet created</Badge>
            )}

            {roomStatus === 'ended' && (
              <Badge variant="red">Ended</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
