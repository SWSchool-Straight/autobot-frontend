import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authTestApi } from '../test/authTestApi';

export default function HistoryPage() {
  const { user } = useAuth();
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await authTestApi();
        console.log('서버 응답 전체:', response);
        setApiResponse(response.data.info);
      } catch (error) {
        console.error("API 요청 실패:", error.response);
        alert(error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Typography>
      {user ? `환영합니다, ${user.name}!` : "사용자 정보를 불러오는 중입니다..."}
    </Typography>
  );
}
