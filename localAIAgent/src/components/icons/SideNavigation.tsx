import React from 'react'

type Props = {
    height?: number;
    width?: number;
}

export default class SideNavigation extends React.Component<Props & { className: string }, {}> {
    render() {
        const { className, width, height } = this.props;
        return (
            <svg xmlns="http://www.w3.org/2000/svg" height={height} viewBox="0 -960 960 960" width={width} className={className}><path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm280-80h280v-560H480v560Z" /></svg>
        )
    }
}