import { FC } from 'react';

import { useTranslation } from '@nuclearplayer/i18n';
import type { Track } from '@nuclearplayer/model';
import {
  TrackTable,
  TrackTableActions,
  TrackTableProps,
} from '@nuclearplayer/ui';

import { useQueueActions } from '../hooks/useQueueActions';
import { useTrackActions } from '../hooks/useTrackActions';
import { ConnectedTrackContextMenu } from './ConnectedTrackContextMenu';

type ConnectedTrackTableProps = Omit<
  TrackTableProps<Track>,
  'actions' | 'meta'
> & {
  actions?: Pick<TrackTableActions<Track>, 'onRemove' | 'onReorder'>;
};

export const ConnectedTrackTable: FC<ConnectedTrackTableProps> = (props) => {
  const {
    actions: externalActions,
    labels: externalLabels,
    ...restProps
  } = props;
  const trackActions = useTrackActions();
  const queueActions = useQueueActions();
  const { t } = useTranslation();

  return (
    <TrackTable
      {...restProps}
      display={{
        displayFavorite: true,
        ...restProps.display,
      }}
      labels={{
        filterPlaceholder: t('tracks.filterPlaceholder'),
        ...externalLabels,
      }}
      actions={{
        onAddToQueue: trackActions.addToQueue,
        onPlayNow: trackActions.playNow,
        onPlayNext: trackActions.addNext,
        onToggleFavorite: trackActions.toggleFavorite,
        onRemove: externalActions?.onRemove,
        onReorder: externalActions?.onReorder,
        onPlayAll: () => {
          queueActions.clearQueue();
          queueActions.addToQueue(restProps.tracks);
        },
        onAddAllToQueue: () => {
          queueActions.addToQueue(restProps.tracks);
        },
      }}
      meta={{
        isTrackFavorite: trackActions.isFavorite,
        ContextMenuWrapper: ConnectedTrackContextMenu,
      }}
    />
  );
};
