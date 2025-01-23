import * as React from 'react';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { authTest } from '../services/authTestService';

export default function HistoryPage() {
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await authTest(); // API 호출
      } catch (err) {
        setError(err.message); // 에러 메시지 설정
      }
    };

    fetchData();
  }, []);

  return (
    <Typography>
      {error ? error : user ? `환영합니다, ${user.name}!` : "사용자 정보를 불러오는 중입니다..."}
    </Typography>
  );
}
