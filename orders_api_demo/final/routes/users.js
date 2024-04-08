

const express = require('express')
const router = express.Router()
const users = require('../controllers/users')

const authAdmin = require('../middleware/authAdmin')
const authSuperAdmin = require('../middleware/authSuperAdmin')


router.get('/',  authAdmin, users.getAllUsers);
// router.get('/super-admin/', authSuperAdmin, users.getAllUsers)
router.delete('/:id', authSuperAdmin, users.deleteUser)
router.get('/salesPersons',authAdmin, users.getAllSalesPersons)
router.get('/salesPersons/:name',authAdmin, users.getSalesPerson)
router.delete('/salesPersons/:name',authAdmin, users.deleteSalesPerson)

router.post('/salesPersons',authAdmin, users.addNewSalesPerson)


module.exports = router;