import React, { Component } from 'react';
import '../App.css';


const blockPos = (xPos, yPos) => {
    return { x: xPos, y: yPos }
}

class BoardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            windowHeight: window.innerHeight,
            windowWidth: window.innerWidth,
            isSymbolLoaded: false,
            isMounted: false
        }
        this.canvasRef = React.createRef(); // Reference for the canvas element
        this.symbol = localStorage.getItem('symbol')
        this.symbolImg = null;
    }

    componentDidMount() {
        const canvas = this.canvasRef.current
        const ctx = canvas.getContext("2d")

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        this.setState({
            isMounted: true
        });

        this.renderBoard()
        this.handleResize();

        window.addEventListener('resize', this.handleResize)

        this.loadSymbol();
    }

    loadSymbol() {
        const img = new Image();

        img.onload = () => {
            this.setState({
                isSymbolLoaded: true
            });
            this.symbolImg = img;
        };

        img.src = this.symbol;
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    renderBoard = () => {
        if (!this.state.isMounted) return;

        console.log("Rendering board")

        const canvas = this.canvasRef.current
        const ctx = canvas.getContext('2d');
        
        this.sortOutBoardSize(canvas)
        
        canvas.removeEventListener('click', this.sendActionRequest)
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                ctx.beginPath();
                ctx.lineWidth = "6";
                ctx.strokeStyle = "white";
                ctx.rect(this.blockPositions[column][row].x, this.blockPositions[column][row].y, this.blockWidth, this.blockHeight)
                ctx.fillStyle = "red";
                ctx.fill();
                ctx.stroke();

                ctx.beginPath();
                ctx.font = "30px Comic Sans MS";
                ctx.fillStyle = "white";
                ctx.textAlign = "center";

                if (this.state.isSymbolLoaded) {
                    this.renderUserImageForSymbol(ctx, row, column);
                } else {
                    ctx.fillText(this.renderCorrectSign(this.props.board.positions[column][row]), (this.blockPositions[column][row].x + this.blockWidth / 2), (this.blockPositions[column][row].y + this.blockHeight / 2));
                }
            }
        }
        canvas.addEventListener('click', this.sendActionRequest)
    }

    renderCorrectSign(sign) {
        if (sign === 0) {
            return ""
        } else if (sign === 1) {
            return "O"
        } else {
            return "X"
        }
    }

    renderUserImageForSymbol = (ctx, row, column) => {
        if (this.props.name === this.props.board.playerOne.id) {
            if (this.props.board.playerOne.symbol === this.props.board.positions[column][row]) {
                ctx.drawImage(this.symbolImg, this.blockPositions[column][row].x + this.blockWidth / 4, this.blockPositions[column][row].y + this.blockHeight / 4, this.blockWidth / 2, this.blockHeight / 2);
            } else {
                ctx.fillText(this.renderCorrectSign(this.props.board.positions[column][row]), (this.blockPositions[column][row].x + this.blockWidth / 2), (this.blockPositions[column][row].y + this.blockHeight / 2));
            }
        } else if (this.props.name === this.props.board.playerTwo.id) {
            if (this.props.board.playerTwo.symbol === this.props.board.positions[column][row]) {
                ctx.drawImage(this.symbolImg, this.blockPositions[column][row].x + this.blockWidth / 4, this.blockPositions[column][row].y + this.blockHeight / 4, this.blockWidth / 2, this.blockHeight / 2);
            } else {
                ctx.fillText(this.renderCorrectSign(this.props.board.positions[column][row]), (this.blockPositions[column][row].x + this.blockWidth / 2), (this.blockPositions[column][row].y + this.blockHeight / 2));
            }
        } else {
            ctx.fillText(this.renderCorrectSign(this.props.board.positions[column][row]), (this.blockPositions[column][row].x + this.blockWidth / 2), (this.blockPositions[column][row].y + this.blockHeight / 2));
        }
    }

    sendActionRequest = (e) => {
        for (let row = 0; row < 3; row++) {
            for (let column = 0; column < 3; column++) {
                if (e.offsetY > this.blockPositions[row][column].y && e.offsetY < this.blockPositions[row][column].y + this.blockHeight
                    && e.offsetX > this.blockPositions[row][column].x && e.offsetX < this.blockPositions[row][column].x + this.blockWidth
                    && this.props.board.positions[row][column] === 0 && this.props.activePlayerId === this.props.name) {
                    this.props.sendBoardAction({ playerId: this.props.name, gameId: this.props.id, position: { row: row, column: column } })
                }
            }
        }
    }

    handleResize = () => this.setState({
        windowHeight: window.innerHeight,
        windowWidth: window.innerWidth
    });

    sortOutBoardSize = (canvas) => {
        canvas.width = this.getSmallestSize() - 50;
        canvas.height = this.getSmallestSize() - 50;

        this.blockWidth = canvas.width / 3;
        this.blockHeight = canvas.height / 3;
        this.blockPositions = [];

        for (var y = 0; y < 3; y++) {
            this.blockPositions[y] = [];
            for (var x = 0; x < 3; x++) {
                this.blockPositions[y][x] = blockPos(this.blockWidth * x, this.blockHeight * y)
            }
        }
    }

    getSmallestSize = () => {
        let size = this.state.windowHeight < this.state.windowWidth ? this.state.windowHeight : this.state.windowWidth
        return size > 630 ? 550 : size
    }

    getWhosTurn = () => {
        return this.props.activePlayerId === this.props.name ? "Your Turn" : "Opponents Turn"
    }

    gameInformation = () => {
        return (
            <h1 className="text-white text-center mb-5 pb-5 titleTextSize specialFont">
                {this.getWhosTurn()}
            </h1>
        )
    }

    render() {
        return (
            <div className="m-auto">
                {this.gameInformation()}
                <canvas ref={this.canvasRef} width={500} height={500} />
                {this.renderBoard()}
            </div>
        )
    }

}

export default BoardComponent;