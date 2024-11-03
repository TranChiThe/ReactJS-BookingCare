import React from 'react';
import { withRouter } from 'react-router-dom';

class ScrollBars extends React.Component {
    componentDidUpdate(prevProps) {
        const { location } = this.props;
        if (location !== prevProps.location) {
            window.scrollTo(0, 0);
        }
    }

    render() {
        return null;
    }
}

export default withRouter(ScrollBars);
