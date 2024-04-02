'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from '@hello-pangea/dnd';
import { Socials, SocialsType } from '@prisma/client';
import { Grip, Lock, Pencil, Trash, Unlock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { IconType } from 'react-icons';
import {
  FaFacebookSquare,
  FaInstagramSquare,
  FaRedditSquare,
  FaSnapchatSquare,
  FaWhatsappSquare,
} from 'react-icons/fa';
import {
  FaDiscord,
  FaGithub,
  FaLinkedin,
  FaSquareThreads,
  FaSquareXTwitter,
  FaYoutube,
} from 'react-icons/fa6';
const iconMap: Record<SocialsType['name'], IconType> = {
  Github: FaGithub,
  Youtube: FaYoutube,
  Instagram: FaInstagramSquare,
  'X (Twitter)': FaSquareXTwitter,
  Facebook: FaFacebookSquare,
  Threads: FaSquareThreads,
  Whatsapp: FaWhatsappSquare,
  Linkedin: FaLinkedin,
  Reddit: FaRedditSquare,
  Discord: FaDiscord,
  Snapchat: FaSnapchatSquare,
};
const colorMap: Record<SocialsType['name'], string> = {
  Github: 'text-black',
  Youtube: 'text-[#FF0000]',
  Instagram: 'text-[#E4405F]',
  'X (Twitter)': 'text-black',
  Facebook: 'text-[#1877F2]',
  Threads: 'text-black',
  Whatsapp: 'text-[#25D366]',
  Linkedin: 'text-[#0077B5]',
  Reddit: 'text-[#FF4500]',
  Discord: 'text-[#5865F2]',
  Snapchat: 'text-[#FFFC00] ',
};

interface SocialsListProps {
  items: Socials[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: ({
    courseId,
    id,
    link,
    name,
    position,
    socialsTypeId,
    isLocked,
  }: {
    id: string;
    name: string;
    link: string;
    socialsTypeId: string;
    position: number;
    courseId: string;
    isLocked: boolean;
  }) => void;
  onDelete: (id: string) => void;
}
export const SocialsList = ({
  items,
  onReorder,
  onEdit,
  onDelete,
}: SocialsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [socials, setSocials] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    setSocials(items);
  }, [items]);

  // console.log('social',socials[0].socialsType!);
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(socials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedSocials = items.slice(startIndex, endIndex + 1);
    setSocials(items);
    const bulkUpdateData = updatedSocials.map((social) => ({
      id: social.id,
      position: items.findIndex((item) => item.id === social.id),
    }));
    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="socials">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {socials.map((social, index) => (
              <Draggable key={social.id} draggableId={social.id} index={index}>
                {(provided) => {
                  // @ts-ignore
                  const Icon: IconType = iconMap[social.socialsType.name];

                  return (
                    <div
                      className={cn(
                        'flex items-center gap-x-2 bg-slate-200 border-slate-200 text-slate-700 rounded-md mb-4 text-sm '
                      )}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                    >
                      <div
                        className={cn(
                          'px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition '
                          // social.isPublished && 'border-sky-200 hover:bg-sky-200'
                        )}
                        {...provided.dragHandleProps}
                      >
                        <Grip className="h-5 w-5 " />
                      </div>
                      <Icon
                        className={cn(
                          'h-8 w-8',
                          // @ts-ignore
                          colorMap[social.socialsType.name]
                        )}
                      />
                      {social.name}
                      <div className="ml-auto pr-2 flex items-center gap-x-2 ">
                        <Badge
                          className={cn(
                            'bg-slate-500',
                            social.isLocked && 'bg-sky-700'
                          )}
                        >
                          {social.isLocked ? 'Locked' : 'Open'}
                        </Badge>
                        <Pencil
                          className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
                          onClick={() => onEdit({ ...social })}
                        />
                        <Trash
                          className="h-4 w-4 cursor-pointer hover:opacity-75 transition"
                          onClick={() => onDelete(social.id)}
                        />
                      </div>
                    </div>
                  );
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};
