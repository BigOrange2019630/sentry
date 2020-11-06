import React from 'react';
import rrwebPlayer from 'rrweb-player';
import * as Sentry from '@sentry/react';

type Props = {
  url: string;
  className?: string;
};

class RRWebReplayer extends React.Component<Props> {
  componentDidMount() {
    this.rrwebPlayer();
  }

  wrapperRef = React.createRef<HTMLDivElement>();

  async rrwebPlayer() {
    const element = this.wrapperRef?.current;

    if (!element) {
      return;
    }

    const {url} = this.props;

    try {
      const resp = await fetch(url);
      const payload = await resp.json();
      const _ = new rrwebPlayer({
        target: element,
        autoplay: false,
        data: payload,
      });
    } catch (err) {
      Sentry.captureException(err);
    }
  }

  render() {
    const {className} = this.props;
    return <div ref={this.wrapperRef} className={className} />;
  }
}

export default RRWebReplayer;
