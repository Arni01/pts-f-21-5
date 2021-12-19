import { router, subscriber } from '../react/react'
import { Component } from '/react/newVersion/Component'
import { dispatch } from '../redux/redux-store'
import { addProducts } from '../redux/main-reducer'
import UsersAPI from '../api/UsersAPI'
import ProductCard from '../components/Main/ProductCard'
import { getDynamicProducts } from '../redux/main-selectors'

class Main extends Component {
  constructor(props) {
    super(props)
    this.state = {
      search: router.getSearch(),
      isReady: false,
      totalCount: 0,
      countProductsCard: 12,
      isFetching: false,
      dynamicListProducts: [],
    }
  }

  getProductsFetch() {
    UsersAPI.getAllProduct().then((products) => {
      console.log('main products', products)

      dispatch(addProducts(products))
      this.setState({
        ...this.state,
        isReady: true,
        totalCount: products.length,
        dynamicListProducts: products.slice(0, this.state.countProductsCard),
      })
    })
  }

  updateSearch() {
    if (this.state.search !== router.search) {
      this.setState({ ...this.state, search: router.search })
      this.getProductsFetch()
    }
  }

  scrollHandler = ({ target }) => {
    const { scrollHeight, scrollTop } = target.documentElement

    if (
      scrollHeight - (scrollTop + window.innerHeight) < 100 &&
      this.state.dynamicListProducts.length < this.state.totalCount &&
      !this.state.isFetching
    ) {
      // this.setState({ ...this.state, isFetching: true })
      this.dynamicAddProducts()
      console.log('fething')
    }
  }

  dynamicAddProducts() {
    const resultDynamic = getDynamicProducts(
      this.state.countProductsCard,
      this.state.dynamicListProducts.length
    )
    console.log(resultDynamic)

    if (resultDynamic) {
      this.setState({
        ...this.state,
        isFetching: false,
        dynamicListProducts: [
          ...this.state.dynamicListProducts,
          ...resultDynamic,
        ],
      })
    }
  }

  componentDidMount() {
    subscriber.push(this.updateSearch.bind(this))
    this.getProductsFetch()
    document.addEventListener('scroll', this.scrollHandler)
  }

  componentDidUpdate() {
    // debugger
    // if (this.state.isFetching) {
    // }
    // debugger
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.scrollHandler)
  }

  render() {
    // const listProductsCard = getDynamicProducts()
    return (
      <div className="grid">
        {this.state.isReady
          ? this.state.dynamicListProducts.map((product) => (
              <ProductCard card={product} />
            ))
          : 'Loading...'}
      </div>
    )
  }
}

export default Main

// import shopList from "../redux/store";

// console.log('cart')
// let typeProduct = '';
// //let MaxView = 13;
// let counter = 0;
// //let ContrCount = 0;
// let stepDouble = 3;
// ////////*******отображание плиток товаров в main блоке********///////
// function render(item) {
//     let createNewItem = document.createElement('article');
//     createNewItem.id = `${item.id}`;
//     if (counter === 0 || counter === stepDouble) {
//         stepDouble = counter + 5;
//         createNewItem.className = `item double`;
//     } else {
//         createNewItem.className = `item`;
//     }
//     createNewItem.style = `background-image:  url(${item.image}); background-size:contain; background-position: center; background-repeat: no-repeat;`;
//     checkProduct(item.category)
//     if(typeProduct==='gold' || typeProduct==='pack'){
//         createNewItem.innerHTML = `
//           <input class="checkbox_input" id="checkbox_${item.id}" type="checkbox">
//           <label class="checkbox_label" for="checkbox_${item.id}"></label>
//         <div class="item_conteiner">
//             <div class="description">
//                 <h2>${item.name}</h2>
//             </div>
//           <span>${item.currency} ${item.price}</span>
//           <button class="purchase">PURSHACE</button>
//         </div>
//         `;
//     } else if (typeProduct==='vehicle'){
//         createNewItem.innerHTML = `
//           <input class="checkbox_input" id="checkbox_${item.id}" type="checkbox">
//           <label class="checkbox_label" for="checkbox_${item.id}"></label>
//         <div class="item_conteiner">
//             <div class="description">
//             <span class="flag ${item.items.nation}"></span>
//               <span class="type ${item.items.type}"></span>
//                 <h2>${item.items.tier} ${item.name}</h2>
//             </div>
//           <span>${item.currency} ${item.price}</span>
//           <button class="purchase">PURSHACE</button>
//         </div>
//         `;
//     }else if (typeProduct==='premium'){
//         createNewItem.innerHTML = `
//           <input class="checkbox_input" id="checkbox_${item.id}" type="checkbox">
//           <label class="checkbox_label" for="checkbox_${item.id}"></label>
//         <div class="item_conteiner">
//             <div class="description">
//                 <h2>${item.name}</h2>
//             </div>
//           <span>${item.currency} ${item.price}</span>
//           <button class="purchase">PURSHACE</button>
//         </div>
//         `;
//     }
//     counter++;
//     shopList.append(createNewItem);
// }

// function checkProduct(arr) {

//     for (let i = 0; i < arr.length; i++) {
//         if(arr[i]==='premium'){
//             typeProduct = 'premium';
//             break;
//         }
//         if (arr[i] === 'vehicle') {
//             typeProduct = 'vehicle';
//             break;
//         } else if (arr[i] === 'gold') {
//             typeProduct = 'gold';
//         }
//     }
// }

// export default render
// import { getCarrent } from '../redux/main-selectors'
// import store from '/redux/redux-store'
// import s from './main.module.css'
// import { updateCarrent } from '../redux/main-reducer'

// console.log(s)
// class Main {
//   current = getCarrent(store.getState())

//   constructor(store) {
//     this.store = store
//   }

//   increment() {
//     this.store.dispacth(updateCarrent(this.current + 1))
//     console.log(this.current)
//   }

//   render() {
//     return `<div class=${s.test}>test style</div>
//     <p>${this.current}</p>
//       <button onclick=${this.increment}>click</button>
//     `
//   }
// }

// const main = new Main(store)
// // store.subscribe(main.render)
// console.log(main)
// export default main.render()
