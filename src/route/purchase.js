// Підключаємо технологію express для back-end сервера
const express = require('express');
const { NormalModule } = require('webpack');
// Cтворюємо роутер - місце, куди ми підключаємо ендпоїнти
const router = express.Router()

// ================================================================

class Item {
  static #list = []
  static #count = 0

  constructor(img, title, description, category, price, amount = 0) {
    this.id = ++Item.#count
    this.img = img
    this.title = title
    this.description = description
    this.category = category
    this.price = price
    this.amount = amount
  }

  static add = (...data) => {
    const newItem = new Item(...data)
    this.#list.push(newItem)
  }

  static getList = () => {
    return this.#list
  }

  static getById = (id) => {
    return this.#list.find((item) => item.id === id)
  }

  static getRandomList = (id) => {
    const filteredList = this.#list.filter(
      (item) => item.id !== id
    )

    const shuffledList = filteredList.sort(
      () => Math.random() - 0.5,
    )
    return shuffledList.slice(0, 3)
  }
}

Item.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Gaming X39 (X39v81)",
  "Intel Core i5-12400F (2.5 - 4.4 ГГц) / RAM, 16 ГБ / SSD 1 ТБ / nVidia GeForce RTX 4060, 8 ГБ / LAN / Без ОД / Без ОС",
  [
    {id: 1, text: 'Готовий до відправки'},
  ],
  32999,
  10,
)

Item.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Overlord GT502 Windows 11 Home (GT502v59Winw)",
  "AMD Ryzen 9 7900X3D (4.4 - 5.6 ГГц) / RAM 32 ГБ / SSD 2 ТБ / nVidia GeForce RTX 4080 Super, 16 ГБ / Без ОД / LAN / Wi-fi / Bluetooth / Windows 11 Home",
  [
    {id: 1, text: 'Готовий до відправки'},
    {id: 2, text: 'ТОП продажів'}
  ],
  145000,
  10,
)

Item.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Gaming X79WHITE (X79WHITEv82)",
  "Intel Core i9-14900F (2.0 - 5.8 ГГц) / RAM 32 ГБ / SSD 1 ТБ / nVidia GeForce RTX 4070, 12 ГБ / без ОД / LAN / без ОС",
  [
    {id: 2, text: 'ТОП продажів'}
  ],
  84999,
  10,
)

Item.add(
  'https://picsum.photos/200/300',
  "Комп'ютер ARTLINE Overlord Carbon Windows 11 Pro (Carbonv01)",
  "AMD Ryzen 9 7950X3D (4.2 - 5.7 ГГц) / RAM 96 ГБ / SSD 4 ТБ (2 x 2 ТБ) / nVidia GeForce RTX 4090, 24 ГБ / LAN / Без ОД / Windows 11 Pro",
  [
    {id: 1, text: 'Готовий до відправки'},
    {id: 2, text: 'ТОП продажів'}
  ],
  340725,
  10,
)

class Purchase {
  static DELIVERY_PRICE = 150
  static #BONUS_FACTOR = 0.1

  static #count = 0
  static #list = []

  static #bonusAccount = new Map()

  static getBonusBalance = (email) => {
    return Purchase.#bonusAccount.get(email) || 0
  }

  static calcBonusAmount = (value) => {
    return value * Purchase.#BONUS_FACTOR
  }

  static updateBonusBalance =(
    email,
    price,
    bonusUse = 0,
  ) => {
    const amount = this.calcBonusAmount(price)

    const currentBalance = Purchase.getBonusBalance(email)

    const updatedBalance =
      currentBalance + amount - bonusUse

    Purchase.#bonusAccount.set(email, updatedBalance)

    console.log(email, updatedBalance)

    return amount
  }

  constructor(data, item) {
    this.id = ++Purchase.#count

    this.firstname = data.firstname
    this.lastname = data.lastname

    this.phone = data.phone
    this.email = data.email

    this.comment = data.comment || null

    this.bonus = data.bonus || 0

    this.promocode = data.promocode || null

    this.totalPrice = data.totalPrice
    this.itemPrice = data.itemPrice
    this.deliveryPrice = data.deliveryPrice
    this.amount = data.amount

    this.item = item 
  }

  static add = (...arg) => {
    const newPurchase = new Purchase(...arg)

    this.#list.push(newPurchase)

    return newPurchase
  }

  static getList = () => {
    return Purchase.#list.reverse().map(({id, item, totalPrice, bonus}) => {
      return {id, item: item.title, totalPrice, bonus}
    });
  }

  static getById = (id) => {
    return Purchase.#list.find((unit) => unit.id === id)
  }

  static updateById = (id, data) => {
    const purchase = Purchase.getById(id)

    if(purchase) {
      if(data.firstname)
        purchase.firstname = data.firstname
      if(data.lastname) purchase.lastname = data.lastname
      if(data.phone) purchase.phone = data.phone
      if(data.email) purchase.email = data.email 

      return true
    }
    else {
      return false
    }
  }
}

class Promocode {
  static #list = []

  constructor(name, factor) {
    this.name = name
    this.factor = factor
  }

  static add = (name, factor) => {
    const newPromoCode = new Promocode(name, factor)
    Promocode.#list.push(newPromoCode)
    return newPromoCode
  }

  static getByName = (name) => {
    return this.#list.find((promo) => promo.name === name)
  }

  static calc = (promo, price) => {
    return price * promo.factor
  }
}

Promocode.add('SUMMER2023', 0.9)
Promocode.add('DISCOUNT50', 0.5)
Promocode.add('SALE25', 0.75)
//=================================================================

// router.get Створює нам один ентпоїнт

// ↙️ тут вводимо шлях (PATH) до сторінки
router.get('/alert-item', function (req, res) {
  // res.render генерує нам HTML сторінку
 
  // ↙️ cюди вводимо назву файлу з сontainer
  res.render('alert-item', {
    // вказуємо назву папки контейнера, в якій знаходяться наші стилі
    style: 'alert-item',

    data: {
      message: 'Операція успішна',
      info: 'Товар створений',
      link: '/test-path',
    },
  })
  // ↑↑ сюди вводимо JSON дані
})

//========================================================================

router.get('/', function (req,res) {

  res.render('purchase-index', {
    style: 'purchase-index',

    data: {
      list: Item.getList(),
    },
  })
})

//=========================================================================

router.get('/purchase-item', function (req,res) {
  let id = Number(req.query.id)
  if (isNaN(id)) {
    id = Item.getList()[0].id;
  }

  res.render('purchase-item', {
    style: 'purchase-item',

    data: {
      list: Item.getRandomList(id),
      item: Item.getById(id),
    },
  })
})

//=========================================================================

router.post('/purchase-create', function (req,res) {
  const id = Number(req.query.id)
  const amount = Number(req.body.amount)

  if(amount < 1) {
    return res.render('alert-item', {
      style: 'alert-item',
  
      data: {
        message: 'Помилка',
        info: 'Некоректна кількість товару',
        link: `/purchase-item?id=${id}`,
      },
    })
  }

  const item = Item.getById(id)

  if(item.amount < 1) {
    return res.render('alert-item', {
      style: 'alert-item',
  
      data: {
        message: 'Помилка',
        info: 'Такої кількікості товару нема в наявності',
        link: `/purchase-item?id=${id}`,
      },
    })
  }
  console.log(item, amount)

  const itemPrice = item.price * amount
  const totalPrice = itemPrice + Purchase.DELIVERY_PRICE
  const bonus = Purchase.calcBonusAmount(totalPrice)

  res.render('purchase-create', {
    style: 'purchase-create',

    data: {
      id: item.id,

      cart: [
        {
          text: `${item.title} (${amount} шт.)`,
          price: itemPrice,
        },
        {
          text: `Доставка`,
          price: Purchase.DELIVERY_PRICE,
        },
      ],
      totalPrice,
      itemPrice,
      deliveryPrice: Purchase.DELIVERY_PRICE,
      amount,
      bonus,            
    },
  })
})

//=========================================================================

router.post('/purchase-submit', function (req,res) {
  const id = Number(req.query.id)
  const purchase_id = Number(req.query.purchase_id)
  
  let {
    totalPrice,
    itemPrice,
    deliveryPrice,
    amount,

    firstname,
    lastname,
    email,
    phone,
    comment,

    promocode,
    bonus,
  } = req.body;

  if (isNaN(id)) {
    Purchase.updateById(purchase_id, {firstname, lastname, email, phone});
    return res.render('alert-item', {
      style: 'alert-item',

      data: {
        message: 'Успішне виконання дії',
        info: 'Дані відредаговані',
        link: `/purchase-list?id=${purchase_id}`,
      },
    })
  }

  const item = Item.getById(id)

  if(!item) {
    return res.render('alert-item', {
      style: 'alert-item',

      data: {
        message: 'Помилка',
        info: 'Товар не знайдено',
        link: `/`,
      },
    })
  }

  if(item.amount < amount) {
    return res.render('alert-item', {
      style: 'alert-item',

      data: {
        message: 'Помилка',
        info: 'Товару нема в потрібній кількості',
        link: `/purchase-item?id=${id}`,
      },
    })
  }

  totalPrice = Number(totalPrice)
  itemPrice = Number(itemPrice)
  deliveryPrice = Number(deliveryPrice)
  amount = Number(amount)
  bonus = Number(bonus)

  console.log(totalPrice, itemPrice, deliveryPrice, amount);

  if(
    isNaN(totalPrice) ||
    isNaN(itemPrice) ||
    isNaN(deliveryPrice) ||
    isNaN(amount) ||
    isNaN(bonus)
  ) {
    return res.render('alert-item', {
      style: 'alert-item',

      data: {
        message: 'Помилка',
        info: 'Некоректні дані',
        link: '/purchase-list',
      }
    })
  }

  console.log(firstname, lastname, email, phone);

  if(!firstname || !lastname || !email || !phone) {
    return res.render('alert-item', {
      style: 'alert-item',

      data: {
        message: `Заповніть обов'язкові поля`,
        info: 'Некоректні дані',
        link: '/purchase-list',
      }
    })
  }

  if(bonus || bonus > 0) {
    const bonusAmount = Purchase.getBonusBalance(email)

    console.log(bonusAmount)

    if(bonus > bonusAmount) {
      bonus = bonusAmount
    }

    Purchase.updateBonusBalance(email, totalPrice, bonus)

    totalPrice -= bonus
  }
  else {
    Purchase.updateBonusBalance(email, totalPrice, 0)
  }

  if(promocode) {
    promocode = Promocode.getByName(promocode)

    if(promocode) {
      totalPrice = Promocode.calc(promocode, totalPrice)
    }
  }

  if(totalPrice < 0) totalPrice = 0

  const purchase = Purchase.add(
    {
      totalPrice,
      itemPrice,
      deliveryPrice,
      amount,
      bonus,

      firstname,
      lastname,
      email,
      phone,
      comment,

      promocode,
    },
    item,
  )

  console.log(purchase)

  res.render('alert-item', {
    style: 'alert-item',

    data: {
      message: 'Успішно',
      info: 'Замовлення створено',
      link: `/purchase-list?id=${purchase.id}`,
    },
  })
})

router.get('/purchase-list', function (req, res) {
  let id = Number(req.query.id)
  
  res.render('purchase-list', {
    style: 'purchase-list',  
    
    data: {
      list: Purchase.getList(),
      item: Purchase.getById(id),
      link: `/purchase-edit?id=${id}`
    },
  })
}) 

router.get('/purchase-edit', function (req, res) {
  let id = Number(req.query.id)  

  res.render('purchase-edit', {
    style: 'purchase-edit',  
    
    data: {
      item: Purchase.getById(id),
    },
  })
})


// Підключаємо роутер до бек-енду
module.exports = router

