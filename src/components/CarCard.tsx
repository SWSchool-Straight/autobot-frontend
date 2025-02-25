import * as React from 'react';
import { CarInfo } from '../types/chat';
import '../styles/car-card.css';
import { useState } from 'react';
import LoadingSpinner from './LoadingSpinner';

interface CarCardProps {
  car: CarInfo;
  onCardClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}

// 중고차 카드 컴포넌트
const CarCard: React.FC<CarCardProps> = ({ car, onCardClick }) => {
  const [isLoading, setIsLoading] = useState(false);

  // 모바일 여부를 확인하는 함수
  const isMobile = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  };

  // URL을 모바일/PC 버전으로 변환하는 함수
  const getAdjustedUrl = (url: string): string => {
    if (isMobile()) {
      // PC URL을 모바일 URL로 변환
      return url.replace('/p/goods/', '/m/goods/');
    }
    return url;
  };

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 디바이스에 맞는 URL 생성
    const adjustedUrl = getAdjustedUrl(car.detailUrl);
    
    setTimeout(() => {
      window.open(adjustedUrl, '_blank');
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <a 
        href={getAdjustedUrl(car.detailUrl)} 
        className="car-card" 
        onClick={handleClick}
        target="_blank" 
        rel="noopener noreferrer"
      >
        <img src={car.imageUrl} alt={car.vehicleName} />
        <div className="car-info">
          <h3>{car.vehicleName}</h3>
          {car.exteriorColor && (
            <p>
              <span className="label">외부 색상</span>
              <span>{car.exteriorColor}</span>
            </p>
          )}
          {car.interiorColor && (
            <p>
              <span className="label">내부 색상</span>
              <span>{car.interiorColor}</span>
            </p>
          )}
          <p>
            <span className="label">주행거리</span>
            <span>{Number(car.vehicleMile).toLocaleString()} km</span>
          </p>
          <p>
            <span className="label">차량번호</span>
            <span>{car.vehicleId}</span>
          </p>
          <p>
            <span className="label">최초등록일</span>
            <span>{car.dateFirstRegistered}</span>
          </p>
          <div className="price-info">
            {car.newCarPrice && (
              <>
                <p className="original-price">
                  <span className="label">신차가격</span>
                  <span>{Number(car.newCarPrice).toLocaleString()}원</span>
                </p>
                <p className="savings">
                  <span className="label">할인된 금액</span>
                  <span className="savings-amount">-{Number(car.savingsAmount).toLocaleString()}원</span>
                </p>
              </>
            )}
            <p className="final-price">
              <span className="label">판매가격</span>
              <span>{Number(car.totalPurchaseAmount).toLocaleString()}원</span>
            </p>
            {car.predictedPrice !== undefined && (
              <p className={`price-comparison ${
                car.predictedPrice === -2 ? 'cheap' : 
                car.predictedPrice === -1 ? 'discount' : 
                car.predictedPrice === 0 ? 'normal' : 
                car.predictedPrice === 1 ? 'expensive' : 
                'premium'
              }`}>
                <span className="label">시세 대비</span>
                <span>
                  {(() => {
                    switch(car.predictedPrice) {
                      case -2: return '특가';
                      case -1: return '할인가';
                      case 0: return '적정가';
                      case 1: return '고가';
                      case 2: return '프리미엄';
                      default: return '적정가';
                    }
                  })()}
                </span>
              </p>
            )}
          </div>
        </div>
      </a>
    </>
  );
};

export default CarCard; 