const { Menu } = require("../models");
const { Op, where } = require("sequelize");
module.exports = {
  // get all menu by role
  getUserMenus: async (role) => {
    try {
      // get all menu
      const menus = await Menu.findAll({
        where: {
          access: {
            [Op.lte]: role,
          },
        },
      });
      // console.log(menus, "menus");
      return menus;
    } catch (error) {
      return error;
    }
  },

  // create new menu
  createMenu: async (data) => {
    try {
      const newMenu = await Menu.create(data);
      return newMenu;
    } catch (error) {
      return error;
    }
  },

  // update menu by dynamic criteria
  updateMenu: async (criteria, data) => {
    try {
      // update menu with dynamic criteria
      const updateMenu = await Menu.update(data, {
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return updateMenu;
    } catch (error) {
      return error;
    }
  },

  // delete menu by dynamic criteria
  deleteMenu: async (criteria) => {
    try {
      // delete menu with dynamic criteria
      const deleteMenu = await Menu.destroy({
        where: {
          [criteria.name]: {
            [Op.eq]: criteria.value,
          },
        },
      });
      return deleteMenu;
    } catch (error) {
      return error;
    }
  },
};
