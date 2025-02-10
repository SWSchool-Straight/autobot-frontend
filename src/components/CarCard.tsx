import * as React from 'react';
import { CarInfo } from '../types/chat';

interface CarCardProps {
  car: CarInfo;
  onCardClick: (e: React.MouseEvent<HTMLAnchorElement>, url: string) => void;
}

// 중고차 카드 컴포넌트
const CarCard = ({ car, onCardClick }: CarCardProps) => {
  return (
    <a 
      href={car.detailUrl} 
      onClick={(e) => onCardClick(e, car.detailUrl)}
      target="_blank" 
      rel="noopener noreferrer" 
      className="car-card"
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
        </div>
      </div>
    </a>
  );
};

export default CarCard; 