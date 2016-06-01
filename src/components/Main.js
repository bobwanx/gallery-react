require('normalize.css/normalize.css');
require('styles/App.less');

import React from 'react';
import ReactDOM from 'react-dom';


let imageDatas = require('../data/data.json');
imageDatas = (function (array) {
	for (let i = 0; i < array.length; i++) {
		let tmp = array[i];
		tmp.imageURL = require('../images/' + tmp.filename);
		array[i] = tmp
	}
	return array
})(imageDatas);
//获取随机数作为位置
function getRangeRandom(low, high){
	return Math.ceil(Math.random() * (high-low) + low);
}

//获取随机旋转度数
function getRangeDegree(){
	return ((Math.random() > 0.5?"":"-")+Math.ceil(Math.random()*30));
}

//图片显示组件
class ImgFigure extends React.Component{
	//图片点击事件柄
	handleClick(e){
		//判断对应图片是否已经在中间若在则翻转，不在则移动到中间
		if(this.props.arrange.isCenter){
			this.props.inverse();
		} else{
			this.props.center();
		}
		//取消默认行为和事件传播
		e.preventDefault();
		e.stopPropagation();
	}

	render(){
		let styleObj = {};
		//设置样式位置
		if(this.props.arrange.pos){
			styleObj = this.props.arrange.pos
		}
		//设置样式旋转角度
		if(this.props.arrange.rotate){
			(['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value){
				styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
			}.bind(this))
		}
		//设置居中图片的z-index
		if(this.props.arrange.isCenter){
			styleObj.zIndex = 11;
		}
		//设置样式类名
		let imgFigureClassName = 'img-figure';
		imgFigureClassName += this.props.arrange.isInverse?" is-inverse" : "";

		return (
			<figure className={imgFigureClassName} style = {styleObj} onClick={this.handleClick.bind(this)}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className='img-title' >{this.props.data.title}</h2>
					<div className='img-back' onClick={this.handleClick.bind(this)}>
						<p>
							{this.props.data.desc}
						</p>
					</div>
				</figcaption>
			</figure>
		)
	}
}
//控制组件
class ControllerUnit extends React.Component{
	//组件点击事件柄
	handleClick(e){
		//判断对应图片是否已经在中间若在则翻转，不在则移动到中间
		if(this.props.arrange.isCenter){
			this.props.inverse();
		} else{
			this.props.center();
		}
		//取消默认行为和事件传播
		e.preventDefault();
		e.stopPropagation();
	}

	render(){
		let controllerUnitClassName = 'controller-unit';

		//根据是否在中间 选取对应的class
		if(this.props.arrange.isCenter){
			controllerUnitClassName += " is-center"
			if(this.props.arrange.isInverse){
				controllerUnitClassName += " is-inverse"
			}
		}
		return (
			<span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}></span>
		)
	}
}
//定义样式对象
function getConstant(){
	return {
		centerPos :{
			left:0,
			right:0
		},
		hPosRange:{
			leftSecX:[0,0],
			rightSecX:[0,0],
			y:[0,0]
		},
		vPosRange:{
			x:[0,0],
			topY:[0,0]
		}
	};
}		

let AppComponent = React.createClass({

	//图片翻转操作
	inverse:function(index){
		return function(){
			let tmpArr = this.state.imgsArrangeArr;
			tmpArr[index].isInverse = !tmpArr[index].isInverse;
			this.setState({
				imgsArrangeArr: tmpArr
			});
		}.bind(this);
	},

	//图片居中操作
	center:function(index){
		return function(){
			this.rearrange(index);
		}.bind(this);
	},

	//所有图片重新调整位置
	rearrange:function(centerIndex){
		let imgsArrangeArr = this.state.imgsArrangeArr,
				Constant = this.Constant,
				centerPos =  Constant.centerPos,
				hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,
        imgsArrangeTopArr = [],
        topImgNum = Math.floor(Math.random() * 2),    // 取一个或者不取
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);
        //设置居中图片
        imgsArrangeCenterArr[0] = {
        	pos:centerPos,
        	rotate:0,
        	isCenter:true
        }
        //取出要布局上侧的图片信息
        topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
        imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);

        imgsArrangeTopArr.forEach(function(val,index){
        	imgsArrangeTopArr[index] = {
        		pos:{
        			top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
        			left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        		},
        		rotate:getRangeDegree(),
        		isCenter:false
        	}
        });
        //布局左右两侧的图片
        for (let i = 0, j =imgsArrangeArr.length,k = j/2; i <j; i++) {
        	let hPosRangeLORX = null;
        	if(i<k){
        		hPosRangeLORX = hPosRangeLeftSecX;
        	}else{
        		hPosRangeLORX = hPosRangeRightSecX;
        	}
        	imgsArrangeArr[i] = {
        		pos:{
        			top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
        			left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        		},
        		rotate:getRangeDegree(),
        		isCenter:false
        	}
        }

        if(imgsArrangeTopArr && imgsArrangeTopArr[0]){
        	imgsArrangeTopArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0]);
        }

        imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);
        this.setState({
        	imgsArrangeArr:imgsArrangeArr
        });
	},

	//定义初始state
	getInitialState:function(){
		return {
			imgsArrangeArr : []
		};
	},
	//组件加载后，计算位置范围
	componentDidMount:function(){
		//获取舞台样式大小
		let stageDOM = ReactDOM.findDOMNode(this.refs.stage),
				stageW = stageDOM.scrollWidth,
				stageH = stageDOM.scrollHeight,
				halfStageW = Math.ceil(stageW/2),
				halfStageH = Math.ceil(stageH/2);
		//获取图片样式大小
		let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
				imgW = imgFigureDOM.scrollWidth,
				imgH = imgFigureDOM.scrollHeight,
				halfImgW = Math.ceil(imgW/2),
				halfImgH = Math.ceil(imgH/2);
		//计算中心图片位置点
		this.Constant = getConstant();
		this.Constant.centerPos = {
			left:halfStageW -halfImgW,
			top:halfStageH-halfImgH
		};
		//计算左侧，右侧区域图片取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
	},

	render:function() {
		let controllerUnits = [],
		    imageFigures = [];

		imageDatas.forEach(function(value,index){
			//初始化每个图片样式
			if(!this.state.imgsArrangeArr[index]){
				this.state.imgsArrangeArr[index] = {
					pos : {
						left:0,
						top:0
					},
					rotate: 0,
					isInverse : false,
					isCenter :false
				}
			}

			imageFigures.push(<ImgFigure data = {value} key={index} ref={'imgFigure'+index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
			controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)}/>);
		}.bind(this));

		return (
		  	<section className='stage' ref="stage">
		  		<section className='img-sec'>
		  			{imageFigures}
		  		</section>
			  	<nav className='controller-nav'>
			  		{controllerUnits}
			  	</nav>
		  	</section>
		);
	}
})
AppComponent.defaultProps = {
};

export default AppComponent;
