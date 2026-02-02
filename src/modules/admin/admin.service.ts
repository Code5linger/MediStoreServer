import { prisma } from '../../lib/prisma';

interface CategoryAction {
  action: 'create' | 'update' | 'delete';
  categoryId?: number;
  name?: string;
}

const getUsers = async () => {
  return prisma.user.findMany({
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const toggleUserStatus = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error('User not found');
  const newStatus = user.status === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
  return prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
  });
};

const getAllOrders = async () => {
  return prisma.order.findMany({
    include: { items: true, customer: true },
    orderBy: { createdAt: 'desc' },
  });
};

const manageCategory = async (data: CategoryAction) => {
  const { action, categoryId, name } = data;

  if (action === 'create') {
    if (!name) throw new Error('Name is required');
    return prisma.category.create({ data: { name } });
  }

  if (action === 'update') {
    if (!categoryId || !name) throw new Error('Category ID and name required');
    return prisma.category.update({
      where: { id: categoryId },
      data: { name },
    });
  }

  if (action === 'delete') {
    if (!categoryId) throw new Error('Category ID required');
    return prisma.category.delete({ where: { id: categoryId } });
  }

  throw new Error('Invalid action');
};

export const AdminService = {
  getUsers,
  toggleUserStatus,
  getAllOrders,
  manageCategory,
};
