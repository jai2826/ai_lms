import '@vidstack/react/player/styles/base.css';

import { useEffect, useRef } from 'react';

import {
  isHLSProvider,
  MediaPlayer,
  MediaProvider,
  type MediaPlayerInstance,
  type MediaProviderAdapter,
  type MediaProviderChangeEvent,
} from '@vidstack/react';

import { VideoLayout } from './components/layouts/video-layout';

interface PlayerProps {
  title: string;
  src: string;
  autoPlay?: boolean;
  poster?: string;
  onCanPlay?: () => void;
  onEnded?: () => void;
}

export function Player({
  autoPlay,
  src,
  title,
  poster,
  onCanPlay,
  onEnded,
}: PlayerProps) {
  let player = useRef<MediaPlayerInstance>(null);

  useEffect(() => {
    // Subscribe to state updates.
    return player.current!.subscribe(({ paused, viewType }) => {
      // console.log('is paused?', '->', state.paused);
      // console.log('is audio view?', '->', state.viewType === 'audio');
    });
  }, []);

  function onProviderChange(
    provider: MediaProviderAdapter | null,
    nativeEvent: MediaProviderChangeEvent
  ) {
    // We can configure provider's here.
    if (isHLSProvider(provider)) {
      provider.config = {};
    }
  }

  // We can listen for the `can-play` event to be notified when the player is ready.

  return (
    <MediaPlayer
      className="w-full aspect-video  text-white font-sans rounded-md ring-media-focus data-[focus]:ring-4"
      title={title}
      src={src}
      crossOrigin
      playsInline
      onProviderChange={onProviderChange}
      onCanPlay={onCanPlay}
      onEnded={onEnded}
      ref={player}
      autoPlay={autoPlay || false}
    >
      <MediaProvider />

      <VideoLayout title={title} />
    </MediaPlayer>
  );
}
