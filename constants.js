const saltValue = 10;

const userRoles = {
    'DEALER': 'dealer',
    'REPRESENTATIVE': 'representative',
    'SHOPKEEPER': 'shopkeeper',
    'ADMIN': 'ADMIN'
};

const statusList = {
    'ONHOLD': 'Onhold',
    'CONFIRMED': 'Confirmed',
    'INITIATED': 'Initiated',
    'PROCESSING': 'Processing',
    'DISPATCHED': 'Dispatched',
    'DELIVERED': 'Delivered',
    'CANCELLED': 'Cancelled'
};

const messages = {
    'INTERNAL_SERVER_ERROR': 'Internal Server Error',
    'OBJECT_NOT_FOUND': 'Object Not Found',
    'BAD_REQUEST': 'Bad Request',
    'UNAUTHORIZED': 'Unauthorized'
}

module.exports = {
    saltValue,
    userRoles,
    statusList,
    messages
}