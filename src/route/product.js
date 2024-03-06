// Підключаємо технологію express для back-end сервера
const express = require('express');
const { NormalModule } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Product {
  static #list = [];

  constructor(name, price, description) {
    this.name = name;
    this.price = price;
    this.description = description;
    this.createData = new Date().toISOString();
    this.id = Math.floor(10000 + Math.random() * 90000);
  }

  static add = (product) => {
    this.#list.push(product);
  }

  static getList = () =>  this.#list;

  static getById = (id) => 
    this.#list.find((product) => product.id === id)

  static deleteById = (id) => {
    const index = this.#list.findIndex(
      (product) => product.id === id
      )
    if(index !== -1) {
      this.#list.splice(index, 1)
      return true
    }
    else {
      return false
    }
  }

}

//=================================================================

// router.get Створює нам один ентпоїнт

router.get('/product-list', function (req, res) {

  const list = Product.getList();
  
  res.render('product-list', {
    style: 'product-list',
    info: 'Список товарів',
    list: list,
  })
})

router.get('/product-create', function (req, res) {
   res.render('product-create', {
    style: 'product-create'
   });
});

//=========================================================================

router.post('/product-create', function (req, res) {
  const {name, price, description} = req.body;
  
  const product = new Product(name, price, description);
  Product.add(product);
  
  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    details: 'Товар успішно створений',
  })
})

//=========================================================================

router.get('/product-edit', function (req, res) {
  const { id } = req.query;
  
  const product = Product.getById(Number(id));

  res.render('product-edit', {
    style: 'product-edit',
    product: product,
  })
})

router.get('/product-delete', function (req, res) {
  const { id } = req.query;

  Product.deleteById(Number(id))

  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    details: 'Товар успішно видалений',
  })
})
//=========================================================================

router.post('/product-edit', function (req, res) {
  const {id, name, price, description} = req.body;
  
  const product = Product.getById(Number(id));
  product.name = name;
  product.price = price;
  product.description = description;
  
  res.render('alert', {
    style: 'alert',
    info: 'Успішне виконання дії',
    details: 'Товар успішно оновлений',
  })
})
//=========================================================================
// Підключаємо роутер до бек-енду
module.exports = router
