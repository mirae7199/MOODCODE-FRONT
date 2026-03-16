import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { useUser, Address } from "../contexts/UserContext";
import { toast } from "sonner";
import { Trash2, Plus, Star } from "lucide-react";

export function ProfilePage() {
  const navigate = useNavigate();
  const {
    userInfo,
    addresses,
    updateUserInfo,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
  } = useUser();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nickname, setNickname] = useState(userInfo?.nickname || "");
  const [phone, setPhone] = useState(userInfo?.phone || "");

  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressForm, setAddressForm] = useState({
    recipientName: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
    isDefault: false,
  });

  const handleSaveProfile = () => {
    updateUserInfo({ nickname, phone });
    setIsEditingProfile(false);
    toast.success("프로필이 수정되었습니다");
  };

  const handleOpenAddressDialog = (address?: Address) => {
    if (address) {
      setEditingAddress(address);
      setAddressForm({
        recipientName: address.recipientName,
        phone: address.phone,
        zipCode: address.zipCode,
        address: address.address,
        detailAddress: address.detailAddress,
        isDefault: address.isDefault,
      });
    } else {
      setEditingAddress(null);
      setAddressForm({
        recipientName: "",
        phone: "",
        zipCode: "",
        address: "",
        detailAddress: "",
        isDefault: false,
      });
    }
    setIsAddressDialogOpen(true);
  };

  const handleSaveAddress = () => {
    if (
      !addressForm.recipientName ||
      !addressForm.phone ||
      !addressForm.zipCode ||
      !addressForm.address
    ) {
      toast.error("필수 항목을 입력해주세요");
      return;
    }

    if (editingAddress) {
      updateAddress(editingAddress.id, addressForm);
      toast.success("배송지가 수정되었습니다");
    } else {
      addAddress(addressForm);
      toast.success("배송지가 추가되었습니다");
    }

    setIsAddressDialogOpen(false);
  };

  const handleDeleteAddress = (id: number) => {
    if (addresses.length === 1) {
      toast.error("최소 1개의 배송지가 필요합니다");
      return;
    }
    deleteAddress(id);
    toast.success("배송지가 삭제되었습니다");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <h1 className="text-3xl mb-8">마이페이지</h1>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">프로필</TabsTrigger>
            <TabsTrigger value="address">배송지 관리</TabsTrigger>
            <TabsTrigger value="orders">주문 내역</TabsTrigger>
          </TabsList>

          {/* 프로필 탭 */}
          <TabsContent value="profile">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">내 정보</h2>
                {!isEditingProfile ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingProfile(true)}
                  >
                    수정
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setIsEditingProfile(false);
                        setNickname(userInfo?.nickname || "");
                        setPhone(userInfo?.phone || "");
                      }}
                    >
                      취소
                    </Button>
                    <Button onClick={handleSaveProfile}>저장</Button>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <Label>이메일</Label>
                  <Input value={userInfo?.email || ""} disabled className="mt-1" />
                </div>
                <div>
                  <Label>닉네임</Label>
                  <Input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    disabled={!isEditingProfile}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>연락처</Label>
                  <Input
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    disabled={!isEditingProfile}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          </TabsContent>

          {/* 배송지 관리 탭 */}
          <TabsContent value="address">
            <div className="bg-white rounded-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl">배송지 목록</h2>
                <Button onClick={() => handleOpenAddressDialog()}>
                  <Plus className="w-4 h-4 mr-2" />
                  배송지 추가
                </Button>
              </div>

              <div className="space-y-4">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className="border rounded-lg p-4 relative"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold">
                            {address.recipientName}
                          </span>
                          {address.isDefault && (
                            <span className="text-xs bg-black text-white px-2 py-0.5 rounded">
                              기본배송지
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {address.phone}
                        </p>
                        <p className="text-sm text-gray-600">
                          ({address.zipCode}) {address.address}{" "}
                          {address.detailAddress}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenAddressDialog(address)}
                        >
                          수정
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="flex-shrink-0"
                          onClick={() => handleDeleteAddress(address.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    {!address.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-2"
                        onClick={() => setDefaultAddress(address.id)}
                      >
                        <Star className="w-4 h-4 mr-1" />
                        기본 배송지로 설정
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 주문 내역 탭 */}
          <TabsContent value="orders">
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-xl mb-6">주문 내역</h2>
              <div className="text-center py-20">
                <p className="text-gray-600">주문 내역이 없습니다</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingAddress ? "배송지 수정" : "배송지 추가"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>받는 분</Label>
              <Input
                value={addressForm.recipientName}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, recipientName: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>연락처</Label>
              <Input
                value={addressForm.phone}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, phone: e.target.value })
                }
                placeholder="010-0000-0000"
                className="mt-1"
              />
            </div>
            <div>
              <Label>우편번호</Label>
              <div className="flex gap-2 mt-1">
                <Input
                  value={addressForm.zipCode}
                  onChange={(e) =>
                    setAddressForm({ ...addressForm, zipCode: e.target.value })
                  }
                  placeholder="06234"
                  className="flex-1"
                />
                <Button variant="outline">우편번호 찾기</Button>
              </div>
            </div>
            <div>
              <Label>주소</Label>
              <Input
                value={addressForm.address}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, address: e.target.value })
                }
                className="mt-1"
              />
            </div>
            <div>
              <Label>상세주소</Label>
              <Input
                value={addressForm.detailAddress}
                onChange={(e) =>
                  setAddressForm({
                    ...addressForm,
                    detailAddress: e.target.value,
                  })
                }
                className="mt-1"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={addressForm.isDefault}
                onChange={(e) =>
                  setAddressForm({ ...addressForm, isDefault: e.target.checked })
                }
                className="w-4 h-4"
              />
              <Label htmlFor="isDefault" className="cursor-pointer">
                기본 배송지로 설정
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsAddressDialogOpen(false)}
            >
              취소
            </Button>
            <Button onClick={handleSaveAddress}>저장</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
