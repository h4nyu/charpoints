import { Row, Sql } from "postgres";
import { CharPoint } from "@charpoints/core";
import { first } from "lodash";

function toCharPoint(r: Row): CharPoint {
  return {
    id: r.id,
    x: r.x,
    y: r.y,
    imageId: r.image_id,
    pointType: r.point_type,
  };
}

export default (sql: Sql) => {
  const filter = async (): Promise<CharPoint[]> => {
    const rows = await sql`SELECT * FROM users`;
    return rows.map(toCharPoint);
  };

  return {
    filter,
  };
};
