import './App.css';
import {
  createBrowserRouter,
  RouterProvider,
  Router
} from 'react-router-dom';
import axios from 'axios';
import { Row, Col, Container } from 'react-bootstrap';
import Registry from './components/pages/Registry';
import CarBuilder from './components/pages/CarBuilder';
import Sidebar from './components/sidebar/Sidebar';
import Home from './components/pages/Home';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    path: "/registry",
    element: <Registry/>
  },
  {
    path: "/builder",
    element: <CarBuilder/>
  }
])

function App() {
  return (
    
    <Row className="App">
      <Col md={2}  className="sidebar">
         <Sidebar/>
      </Col>
      <Col md={10}>
        <div className="view-wrapper">
        <RouterProvider router={router} />
        </div>
      </Col>
    </Row>
  );
}

export default App;
