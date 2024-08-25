import { AuthProvider } from "./context/AuthContext";
import { CustomerProvider } from "./context/CustomerContext";
import { JadwalProduksiProvider } from "./context/JadwalProduksiContext";
import { PesananProvider } from "./context/PesananContext";
import { PrintProvider } from "./context/PrintContext";
import { SpkProvider } from "./context/SpkContext";
import { UserProvider } from "./context/UserContext";
import MainRoute from "./routes/MainRoute";

function App() {
  return (
    <>
      <PrintProvider>
        <AuthProvider>
          <UserProvider>
            <PesananProvider>
              <SpkProvider>
                <JadwalProduksiProvider>
                  <CustomerProvider>
                    <MainRoute />
                  </CustomerProvider>
                </JadwalProduksiProvider>
              </SpkProvider>
            </PesananProvider>
          </UserProvider>
        </AuthProvider>
      </PrintProvider>
    </>
  );
}

export default App;
