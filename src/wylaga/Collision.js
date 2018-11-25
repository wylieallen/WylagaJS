export function entitiesCollide(entity1, entity2) {
    const
        minX1 = entity1.getX(),
        minY1 = entity1.getY(),
        minX2 = entity2.getX(),
        minY2 = entity2.getY(),
        maxX1 = minX1 + entity1.getWidth(),
        maxY1 = minY1 + entity1.getHeight(),
        maxX2 = minX2 + entity2.getWidth(),
        maxY2 = minY2 + entity2.getHeight();

    if (minY1 > maxY2 || minY2 > maxY1)
    {
        return false;
    }

    else return !(minX1 > maxX2 || minX2 > maxX1);
}