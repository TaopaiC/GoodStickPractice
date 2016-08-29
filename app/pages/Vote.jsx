import React, { Component, PropTypes } from 'react';
import Page from 'pages/Page';
import VoteContainer from 'containers/Vote';

class Vote extends Component {
  render() {
    return (
      <Page metaData={this.getMetaData()}>
        <VoteContainer {...this.props} />
      </Page>
    );
  }

  getMetaData() {
    return {
      title: this.pageTitle(),
      meta: this.pageMeta(),
      link: this.pageLink()
    };
  }

  pageTitle() {
    return 'Vote | reactGo';
  }

  pageMeta() {
    return [
      { content: "A page about voting"}
    ];
  }

  pageLink() {
    return [];
  }
}

export default Vote;

