import React from 'react';
import rrwebPlayer from 'rrweb-player';
import * as Sentry from '@sentry/react';

import {t} from 'app/locale';
import {Client} from 'app/api';
import LoadingError from 'app/components/loadingError';
import LoadingIndicator from 'app/components/loadingIndicator';
import {Panel} from 'app/components/panels';
import withApi from 'app/utils/withApi';

type Props = {
  api: Client;
  url: string;
  className?: string;
};

type State = {
  isLoading: boolean;
  hasError: boolean;
};

class RRWebReplayer extends React.Component<Props, State> {
  state: State = {
    isLoading: true,
    hasError: false,
  };
  componentDidMount() {
    this.rrwebPlayer();
  }

  wrapperRef = React.createRef<HTMLDivElement>();

  newRRWebPlayer: any;

  rrwebPlayer = async () => {
    this.setState({isLoading: true, hasError: false});

    const element = this.wrapperRef?.current;

    if (!element) {
      return;
    }

    const {url, api} = this.props;

    try {
      const resp = await api.requestPromise(url);
      const payload = await resp.json();
      this.newRRWebPlayer = new rrwebPlayer({
        target: element,
        autoplay: false,
        data: payload,
      });
      this.setState({isLoading: false});
    } catch (err) {
      Sentry.captureException(err);
      this.setState({isLoading: false, hasError: true});
    }
  };

  renderSubContent() {
    const {hasError, isLoading} = this.state;

    if (isLoading) {
      return <LoadingIndicator />;
    }

    if (hasError) {
      return (
        <LoadingError
          message={t('There was a problem loading the player')}
          onRetry={this.rrwebPlayer}
        />
      );
    }

    return null;
  }

  render() {
    const {className} = this.props;

    const subContent = this.renderSubContent();

    const content = (
      <div ref={this.wrapperRef} className={className}>
        {subContent}
      </div>
    );

    if (!subContent) {
      return <Panel>{content}</Panel>;
    }

    return content;
  }
}

export default withApi(RRWebReplayer);
