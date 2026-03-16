import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from "react";

export interface Address {
  id: number;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  detailAddress: string;
  isDefault: boolean;
}

export interface UserInfo {
  email: string;
  nickname: string;
  phone: string;
}

interface UserContextType {
  userInfo: UserInfo | null;
  isAuthenticated: boolean;
  token: string | null;
  addresses: Address[];
  login: (token: string, user: UserInfo) => void;
  logout: () => void;
  updateUserInfo: (info: Partial<UserInfo>) => void;
  addAddress: (address: Omit<Address, "id">) => void;
  updateAddress: (id: number, address: Partial<Address>) => void;
  deleteAddress: (id: number) => void;
  setDefaultAddress: (id: number) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => {
    // 렌더링 전 동기적으로 URL의 토큰을 확인하여 초기 상태로 설정합니다.
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    if (accessToken) {
      localStorage.setItem('token', accessToken);
      const refreshToken = params.get('refreshToken');
      if (refreshToken) localStorage.setItem('refreshToken', refreshToken);
      // URL에서 토큰 숨기기
      window.history.replaceState({}, document.title, window.location.pathname);
      return accessToken;
    }
    return localStorage.getItem('token');
  });
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const isAuthenticated = !!token;

  const [addresses, setAddresses] = useState<Address[]>(() => {
    const saved = localStorage.getItem("addresses");
    return saved ? JSON.parse(saved) : [];
  });

  const fetchAddresses = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    try {
      const res = await fetch("/api/v1/addresses", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const serverAddresses = data.addresses.map((a: any) => ({
          id: a.id,
          recipientName: a.recipientName,
          phone: a.phoneNumber,
          zipCode: "", // 백엔드에 없으면 빈값 혹은 추가 필요
          address: a.roadAddress,
          detailAddress: a.detailAddress,
          isDefault: a.isDefault,
        }));
        setAddresses(serverAddresses);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isAuthenticated, token]);

  useEffect(() => {
    localStorage.setItem("addresses", JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
    }
  }, [isAuthenticated, fetchAddresses]);

  // TODO: Fetch user info using token on mount
  useEffect(() => {
    if (token) {
      fetch("/api/v1/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => {
        if (!res.ok) {
          if (res.status === 401) {
            logout();
          }
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then(data => {
        setUserInfo({
          email: data.email || "user@example.com",
          nickname: data.nickname || "사용자",
          phone: data.phone || "010-0000-0000",
        });
      })
      .catch(err => {
        console.error(err);
      });
    } else {
      setUserInfo(null);
    }
  }, [token]);

  const login = (newToken: string, user: UserInfo) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUserInfo(user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserInfo(null);
  };

  const updateUserInfo = (info: Partial<UserInfo>) => {
    if (userInfo) {
      setUserInfo({ ...userInfo, ...info });
    }
  };

  const addAddress = async (address: Omit<Address, "id">) => {
    // 핸드폰 번호에 하이픈이 없으면 추가해주는 간단한 로직 (백엔드 정규식: ^01(?:0|1|[6-9])-(?:\d{3}|\d{4})-\d{4}$)
    let formattedPhone = address.phone;
    if (!formattedPhone.includes('-') && formattedPhone.length >= 10) {
      formattedPhone = formattedPhone.replace(/(\d{3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }

    if (isAuthenticated && token) {
      try {
        const res = await fetch("/api/v1/addresses", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            recipientName: address.recipientName,
            phoneNumber: formattedPhone,
            roadAddress: address.address,
            detailAddress: address.detailAddress,
            isDefault: address.isDefault,
          })
        });
        if (res.ok) {
          fetchAddresses(); // 성공 후 목록 다시 불러오기
          return;
        } else {
          const errData = await res.json().catch(() => null);
          console.error("배송지 추가 실패:", errData);
          alert("배송지 추가에 실패했습니다. 입력값을 확인해주세요. (예: 010-1234-5678)");
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // 비로그인 또는 실패 시 로컬에 저장
    const newId = Math.max(0, ...addresses.map((a) => a.id)) + 1;
    const newAddress = { ...address, id: newId };

    if (address.isDefault) {
      setAddresses((prev) => [
        ...prev.map((a) => ({ ...a, isDefault: false })),
        newAddress,
      ]);
    } else {
      setAddresses((prev) => [...prev, newAddress]);
    }
  };

  const updateAddress = (id: number, address: Partial<Address>) => {
    // TODO: 백엔드에 주소 수정 API가 있다면 연결 필요
    setAddresses((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          return { ...a, ...address };
        }
        if (address.isDefault) {
          return { ...a, isDefault: false };
        }
        return a;
      })
    );
  };

  const deleteAddress = async (id: number) => {
    if (isAuthenticated && token) {
      try {
        const res = await fetch(`/api/v1/addresses/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          fetchAddresses();
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }
    setAddresses((prev) => prev.filter((a) => a.id !== id));
  };

  const setDefaultAddress = (id: number) => {
    setAddresses((prev) =>
      prev.map((a) => ({
        ...a,
        isDefault: a.id === id,
      }))
    );
  };

  return (
    <UserContext.Provider
      value={{
        userInfo,
        isAuthenticated,
        token,
        addresses,
        login,
        logout,
        updateUserInfo,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within UserProvider");
  }
  return context;
}
