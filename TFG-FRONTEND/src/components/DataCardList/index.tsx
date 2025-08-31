import React from 'react'
import { Col } from 'antd';
import DataCard from '@/components/DataCard';

type DataCardListProps = {
  data: {
    title: string;
    value: number;
    precision?: number;
    valuePrefix?: string;
    valueSuffix?: string;
    description: string;
    descriptionSuffix?: string;
    change: number;
    icon: React.ReactNode;
  }[],
  loading?: boolean;
};

const DataCardList = ({ data, loading = false }: DataCardListProps) => {
  return (
    data.length > 0 &&

    data.map(({
      title,
      value,
      change,
      icon,
      description,
      descriptionSuffix,
      precision,
      valuePrefix,
      valueSuffix,
    }, index) =>
      <Col key={index}
        xs={24}
        sm={24}
        md={12}
        lg={6}
        xl={6}
      >
        <DataCard
          title={title}
          value={value}
          change={change}
          icon={icon}
          description={description}
          descriptionSuffix={descriptionSuffix}
          precision={precision}
          valuePrefix={valuePrefix}
          valueSuffix={valueSuffix}
          loading={loading}
        />
      </Col>
    )
  )
}

export default DataCardList