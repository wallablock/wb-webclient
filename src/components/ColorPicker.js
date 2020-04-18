import React, { Component } from 'react';

class ColorPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            colors: ""
        }
    }

    handleClick = (newC) => {
        this.setState({
            colors: newC
        })
        this.props.onChange(newC)
    }

    render() {
        return (
            <div className="flex">
                <button onClick={() => {this.handleClick("uk")}}>
                    UK
                </button>
                <button onClick={() => {this.handleClick("bz")}}>
                    BZ
                </button>  
                    
                <p>Color: {this.state.colors}</p>
            </div>
        );

    }

}

export default ColorPicker;


//El estado de los paises debo elevarlo al homecomponent, ya que desde SelectedFilters invocaremos a una funcion para limpiar estado de paises.
//Tanto el estado como la funcion deben encontrarse en homecomponent.
//Desde homcomponent bajaremos @funcion-limpiar-estado. HomeComponent -> Results (SelectedFilters)
//El estado lo bajaremos por prop. HomeComponent -> Header -> SearchFilters -> PaisFilter(...)


//REMINDER: probar ImageReader con IPFS abierto.
//REMINDER: se puede borrar carpeta test