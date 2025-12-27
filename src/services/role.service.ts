import Logging from "../library/Logging";
import { roleRepository } from "../repositories";

/* =========================
   SEED ROLES
========================= */
const createDefaultRoles = async () => {
  const count = await roleRepository.count();

  if (count === 0) {
    await roleRepository.createMany([{ name: "user" }, { name: "admin" }]);

    Logging.info("✅ Roles 'user' e 'admin' criadas com sucesso");
  } else {
    Logging.info("ℹ️ Roles já existem, seed ignorado");
  }
};

/* =========================
   LIST ROLES
========================= */
const listRoles = async (page: number, limit: number) => {
  return await roleRepository.findAllWithPagination(page, limit);
};

export default {
  createDefaultRoles,
  listRoles,
};
