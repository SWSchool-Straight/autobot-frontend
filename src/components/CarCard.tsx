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

  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement> | React.TouchEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!car.detailUrl) {
      console.error('상세 페이지 URL이 없습니다.');
      setIsLoading(false);
      return;
    }

    // URL을 모바일 환경에 맞게 변환
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    let targetUrl = car.detailUrl;
    
    if (isMobile) {
      try {
        const url = new URL(car.detailUrl);
        // www. 도메인을 m. 도메인으로 변경
        if (url.hostname.startsWith('www.')) {
          url.hostname = 'm.' + url.hostname.substring(4);
          targetUrl = url.href;
        }
      } catch (error) {
        console.error('URL 처리 중 오류:', error);
      }
    }

    setTimeout(() => {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      setIsLoading(false);
    }, 500);
  };

  return (
    <>
      {isLoading && <LoadingSpinner />}
      <a 
        href={car.detailUrl} 
        className="car-card" 
        onClick={handleClick}
        onTouchEnd={(e) => {
          e.preventDefault();
          handleClick(e as any);
        }}
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