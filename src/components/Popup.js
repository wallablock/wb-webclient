import React from 'react';  
import '../App.css';  
import ImageReader from './ImageReader';

class Popup extends React.Component {  
    render() {  
        return (  
            <div className='popup_background' onClick={this.props.closePopup}>  
                <div className='popup' onClick={(e) => {e.stopPropagation();}}>  
                    <h2>{this.props.offer.title}</h2>
                    <h2>{this.props.offer.price}</h2>  
                    <ImageReader />

                </div>  
            </div>  
        );  
    }  
}  

//                    <button onClick={this.props.closePopup}>close me</button>  


export default Popup;