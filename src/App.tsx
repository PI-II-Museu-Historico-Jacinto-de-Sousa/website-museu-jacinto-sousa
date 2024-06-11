import 'dayjs/locale/pt-br';
import { RouterProvider } from 'react-router-dom';
import router from './router/router';
import { getItemAcervo } from './Utils/itemAcervoFirebase';
import { get } from 'firebase/database';

function App() {
  getItemAcervo("publico/publico/sqn06jYFrgxDiwMiAAoc").then((item) => {
    console.log(item);
  })
  return (
    <RouterProvider router={router} />
  );

}


export default App
