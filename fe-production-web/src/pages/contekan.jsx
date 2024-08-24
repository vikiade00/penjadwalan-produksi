import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableCaption,
  TableHeader,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePesanan } from "@/context/PesananContext";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";

function Pesanan() {
  const {
    pesanan,
    fetchPesanan,
    addPesanan,
    updatePesanan,
    deletePesanan,
    customers,
    products,
  } = usePesanan();

  const [newPesanan, setNewPesanan] = useState({
    id_customer: "",
    id_produk: "",
    tanggal_pesanan: "",
    tanggal_tenggat: "",
    jumlah_produksi: "",
    keterangan: "",
  });

  const [selectedPesanan, setSelectedPesanan] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dialogMode, setDialogMode] = useState("add");

  useEffect(() => {
    const loadPesanan = async () => {
      setLoading(true);
      await fetchPesanan();
      setLoading(false);
    };

    loadPesanan();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPesanan((prev) => ({ ...prev, [name]: value }));
  };

  const handleBahanChange = (index, field, value) => {
    const updatedBahan = [...newPesanan.keperluan_bahan];
    updatedBahan[index][field] = value;
    setNewPesanan({ ...newPesanan, keperluan_bahan: updatedBahan });
  };

  const addBahanField = () => {
    setNewPesanan((prev) => ({
      ...prev,
      keperluan_bahan: [...prev.keperluan_bahan, { id_bahan: "", jumlah: "" }],
    }));
  };

  const removeBahanField = (index) => {
    const updatedBahan = newPesanan.keperluan_bahan.filter(
      (_, i) => i !== index
    );
    setNewPesanan((prev) => ({ ...prev, keperluan_bahan: updatedBahan }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (dialogMode === "add") {
      await addPesanan(newPesanan);
    } else {
      await updatePesanan(selectedPesanan._id, newPesanan);
    }
    setIsDialogOpen(false);
    setNewPesanan({
      id_customer: "",
      id_produk: "",
      tanggal_pesanan: "",
      tanggal_tenggat: "",
      jumlah_produksi: "",
      keterangan: "",
    });
  };

  const handleEditClick = (pesanan) => {
    setSelectedPesanan(pesanan);
    setNewPesanan({
      id_customer: pesanan.id_customer._id,
      id_produk: pesanan.id_produk._id,
      tanggal_pesanan: pesanan.tanggal_pesanan.split("T")[0],
      tanggal_tenggat: pesanan.tanggal_tenggat.split("T")[0],
      jumlah_produksi: pesanan.jumlah_produksi,
      //   keperluan_bahan: pesanan.keperluan_bahan.map((bahan) => ({
      //     id_bahan: bahan.id_bahan,
      //     jumlah: bahan.jumlah,
      //   })),
      keterangan: pesanan.keterangan,
    });
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (pesanan) => {
    setSelectedPesanan(pesanan);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    await deletePesanan(selectedPesanan._id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      <Button
        onClick={() => {
          setDialogMode("add");
          setIsDialogOpen(true);
        }}
      >
        Tambah Pesanan
      </Button>

      <Dialog
        className="overflow-auto max-h-32"
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogMode === "add" ? "Tambah Pesanan" : "Edit Pesanan"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="id_customer">Customer</Label>
                <Select
                  id="id_customer"
                  value={newPesanan.id_customer}
                  onValueChange={(value) =>
                    setNewPesanan({ ...newPesanan, id_customer: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer._id} value={customer._id}>
                        {customer.nama}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="id_produk">Produk</Label>
                <Select
                  id="id_produk"
                  value={newPesanan.id_produk}
                  onValueChange={(value) =>
                    setNewPesanan({ ...newPesanan, id_produk: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih Produk" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product._id} value={product._id}>
                        {product.nama_produk}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="tanggal_pesanan">Tanggal Pesanan</Label>
                <Input
                  id="tanggal_pesanan"
                  type="date"
                  name="tanggal_pesanan"
                  value={newPesanan.tanggal_pesanan}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="tanggal_tenggat">Tanggal Tenggat</Label>
                <Input
                  id="tanggal_tenggat"
                  type="date"
                  name="tanggal_tenggat"
                  value={newPesanan.tanggal_tenggat}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="jumlah_produksi">Jumlah Produksi</Label>
                <Input
                  id="jumlah_produksi"
                  type="number"
                  name="jumlah_produksi"
                  value={newPesanan.jumlah_produksi}
                  onChange={handleInputChange}
                />
              </div>
              {/* <div>
                <Label>Keperluan Bahan</Label>
                {newPesanan.keperluan_bahan.map((bahan, index) => (
                  <div key={index} className="flex space-x-2">
                    <Select
                      value={bahan.id_bahan}
                      onValueChange={(value) =>
                        handleBahanChange(index, "id_bahan", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih Bahan" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product._id} value={product._id}>
                            {product.nama}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      value={bahan.jumlah}
                      onChange={(e) =>
                        handleBahanChange(index, "jumlah", e.target.value)
                      }
                    />
                    <Button
                      type="button"
                      onClick={() => removeBahanField(index)}
                    >
                      Hapus
                    </Button>
                  </div>
                ))}
                <Button type="button" onClick={addBahanField}>
                  Tambah Bahan
                </Button>
              </div> */}
              {/* <div>
                <Label htmlFor="status_pesanan">Status Pesanan</Label>
                <Input
                  id="status_pesanan"
                  type="text"
                  name="status_pesanan"
                  value={newPesanan.status_pesanan}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="prioritas_pesanan">Prioritas Pesanan</Label>
                <Input
                  id="prioritas_pesanan"
                  type="text"
                  name="prioritas_pesanan"
                  value={newPesanan.prioritas_pesanan}
                  onChange={handleInputChange}
                />
              </div> */}
              <div>
                <Label htmlFor="keterangan">Keterangan</Label>
                <Input
                  id="keterangan"
                  type="text"
                  name="keterangan"
                  value={newPesanan.keterangan}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <Button type="submit" className="mt-4">
              {dialogMode === "add" ? "Tambah" : "Perbarui"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Pesanan</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pesanan ini?
          </DialogDescription>
          <Button variant="destructive" onClick={handleDeleteConfirm}>
            Hapus
          </Button>
        </DialogContent>
      </Dialog>

      {loading ? (
        <Loader />
      ) : (
        <Table>
          <TableCaption>Daftar Pesanan</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nama Customer</TableHead>
              <TableHead>Nama Produk</TableHead>
              <TableHead>Tanggal Pesanan</TableHead>
              <TableHead>Tanggal Tenggat</TableHead>
              <TableHead>Jumlah Produksi</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Prioritas</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.isArray(pesanan) && pesanan.length > 0 ? (
              pesanan.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.id_customer.nama}</TableCell>
                  <TableCell>{p.id_produk.nama_produk}</TableCell>
                  <TableCell>{p.tanggal_pesanan.split("T")[0]}</TableCell>
                  <TableCell>{p.tanggal_tenggat.split("T")[0]}</TableCell>
                  <TableCell>{p.jumlah_produksi}</TableCell>
                  <TableCell>{p.status_pesanan}</TableCell>
                  <TableCell>{p.prioritas_pesanan}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => handleEditClick(p)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleDeleteClick(p)}
                    >
                      Hapus
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8}>Tidak ada data pesanan.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default Pesanan;
