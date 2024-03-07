import { TableColumnOptions } from 'typeorm';

export const generatePrimaryColumn = (
  comment: string = '고유 ID',
): TableColumnOptions => {
  return {
    name: 'id',
    type: 'int',
    unsigned: true,
    isPrimary: true,
    isNullable: false,
    isGenerated: true,
    generationStrategy: 'increment',
    comment,
  };
};

export const generateUserIdColumn = (
  comment: string = '유저 고유 ID',
): TableColumnOptions => {
  return {
    name: 'user_id',
    type: 'int',
    unsigned: true,
    isNullable: false,
    comment,
  };
};

export const generateCategoryIdColumn = (
  comment: string = '카테고리 고유 ID',
): TableColumnOptions => {
  return {
    name: 'category_id',
    type: 'int',
    unsigned: true,
    isNullable: false,
    comment,
  };
};

export const generateHeadColumn = (
  comment: string = '게시글 제목',
): TableColumnOptions => {
  return {
    name: 'head',
    type: 'varchar',
    length: '30',
    isNullable: false,
    comment,
  };
};

export const generateBodyColumn = (
  comment: string = '게시글 본문',
): TableColumnOptions => {
  return {
    name: 'body',
    type: 'text',
    isNullable: false,
    comment,
  };
};

export const generateBooleanColumn = (
  name: string,
  comment: string,
): TableColumnOptions => {
  return {
    name: name,
    type: 'tinyint',
    length: '1',
    unsigned: true,
    default: 0,
    isNullable: false,
    comment: comment,
  };
};

export const generateCreatedAtColumn = (
  comment: string = '생성 일자',
): TableColumnOptions => {
  return {
    name: 'created_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    comment,
  };
};

export const generateUpdatedAtColumn = (
  comment: string = '수정 일자',
): TableColumnOptions => {
  return {
    name: 'updated_at',
    type: 'timestamp',
    isNullable: false,
    default: 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
    comment,
  };
};

export const generateDeletedAtColumn = (
  comment: string = '삭제 일자',
): TableColumnOptions => {
  return {
    name: 'deleted_at',
    type: 'timestamp',
    isNullable: true,
    comment,
  };
};

export const generateCountColumn = (
  name: string = 'count',
  comment: string = '카운트',
): TableColumnOptions => {
  return {
    name,
    type: 'int',
    unsigned: true,
    isNullable: false,
    default: 0,
    comment,
  };
};
