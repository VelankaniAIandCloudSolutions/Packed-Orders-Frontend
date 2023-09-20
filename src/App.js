import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Menu from './pages/Menu';
import Login from './pages/Login';
import Customers from './pages/Customers'
import Orders from './pages/Order'
import Home from './pages/Home';
import MenuSelection from './pages/MenuSelection';
import AllOrders from './pages/AllOrders';
import EditOrder from './pages/EditOrder';
import CartPage from './pages/CartPage';
import LoginTest from './pages/LoginTest';
import DayWiseSaleRport from './pages/DayWiseSaleRport';
import ItemSaleReport from './pages/ItemSaleReport';
import CompanySaleReport from './pages/CompanySaleReport';
import FirstMenu from './pages/FirstMenu';
import MobileTest from './pages/MobileTest';
import CalendarView from './pages/CalendarView';
import PastOrders from './pages/PastOrders';
import OpenOrders from './pages/OpenOrders';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/menu' element={<Menu />} />
          <Route path='/menu/:id' element={<MenuSelection />} />
          <Route path='/home' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/customer' element={<Customers />} />
          <Route path='/order' element={<Orders />} />
          <Route path='/' element={<Login />} />
          <Route path='/allorder' element={<AllOrders />} />
          <Route path='/editOrder/:id' element={<EditOrder />} />
          <Route path='/cart' element={<CartPage />} />
          <Route path='/logintest' element={<LoginTest />} />
          <Route path='/dayreport' element={<DayWiseSaleRport />} />
          <Route path='/itemreport' element={<ItemSaleReport />} />
          <Route path='/companyreport' element={<CompanySaleReport />} />
          <Route path='/firstmenu' element={<FirstMenu />} />
          <Route path='/mobiletest' element={<MobileTest />} />
          <Route path='/calendarview' element={<CalendarView />} />
          <Route path='/pastorder' element={<PastOrders />} />
          <Route path='/openorder' element={<OpenOrders />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
