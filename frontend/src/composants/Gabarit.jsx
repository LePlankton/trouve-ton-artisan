import { Outlet } from 'react-router-dom';

function Gabarit() {
  return (
    <>
      <header>Header provisoire</header>

      <main>
        <Outlet />
      </main>

      <footer>Footer provisoire</footer>
    </>
  );
}

export default Gabarit;
