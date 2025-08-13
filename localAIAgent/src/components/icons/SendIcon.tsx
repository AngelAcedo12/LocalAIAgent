

import React from 'react'

type Props = {
    height?: number;
    width?: number;
}

export default class SendIcon extends React.Component<Props & { className: string }, {}> {
    render() {
        const { className, width, height } = this.props;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} className={className}><path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" /></svg>

        )


    }
}