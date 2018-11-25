import React from 'react';

export default class DisplayCanvas extends React.Component
{
    root;
    canvas;
    canvasRef;

    constructor(props)
    {
        super(props);
        this.canvasRef = React.createRef();
        this.canvas = <canvas width={props.width} height={props.height} style={{border:"1px solid #000000"}} ref={this.canvasRef}/>;
        this.root = props.root;
    }

    render = () => this.canvas;

    repaint = () => {
        const ctx = this.getContext();
        ctx.beginPath();
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
        this.root.display(ctx);
    };

    getWidth = () => this.canvasRef.current.width;
    getHeight = () => this.canvasRef.current.height;

    update = () => this.root.update();

    setRoot = (root) => this.root = root;

    getContext = () => this.canvasRef.current.getContext("2d");
}