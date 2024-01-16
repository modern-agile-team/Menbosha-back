export interface RequiredHotPostColumn {
  id: number;
  parentId: number;
  likeCount: number;
}

export interface RequiredHotPostColumnNew {
  id: number;
  popularAt: Date | null;
}
