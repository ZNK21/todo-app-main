using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Linq;
using todoApp.Context;
using todoApp.Entities;
using todoApp.Models;

namespace todoApp.Controllers {


    public class todoController : Controller {
        public IActionResult Index() {
            todoModels model = new todoModels();
            model.todo = _Data.todo.OrderBy(p => p.position).ToList();

            model.items = _Data.todo.Where(p => p.status == "active").Count();
            return View(model);
        }
        private readonly todoContext _Data;

        public todoController(todoContext Data) {
            _Data = Data;
        }

        [HttpPost]
        public IActionResult newItem(todo i) {
            bool status = false;
            var result = new { status = status };

            try {
                todo ii = new todo {
                    description = i.description,
                    position = _Data.todo.Count() + 1,
                    status = "active",
                };

                _Data.todo.Add(ii);
                if (_Data.SaveChanges() > 0) {
                    status = true;
                } else {
                    status = false;
                }
            } catch (Exception ex) {
                Debug.WriteLine(ex);
            }

            result = new { status };
            return Json(result);

        }

        [HttpPost]
        public JsonResult completeItem(int id, string status) {
            bool state = false;
            var result = new { state = state };
            var idReg = _Data.todo.Find(id);

            try {
                if (idReg != null) {
                    idReg.status = status;
                    _Data.Entry(idReg).State = EntityState.Modified;
                    _Data.SaveChanges();
                    result = new { state = true };
                    return Json(result);
                }
            } catch (Exception ex) {
                Debug.WriteLine(ex);
                return null;
            }
            return Json(result);
        }

        [HttpDelete]
        public JsonResult deleteItem(int id) {
            bool state = false;
            var result = new { state = state };
            var idReg = _Data.todo.Find(id);

            try {
                if (idReg != null) {
                    _Data.todo.Remove(idReg);
                    if (_Data.SaveChanges() > 0) {
                        result = new { state = true };
                        return Json(result);
                    } else {
                        result = new { state = false };
                        return Json(result);
                    }

                }
            } catch (Exception ex) {
                Debug.WriteLine(ex);
                return null;
            }
            return Json(result);
        }


        public JsonResult clear() {
            bool state = false;
            var result = new { state = state };

            var regs = _Data.todo.Where(p => p.status == "completed").ToList();

            try {
                for (var i = 0; i < regs.Count(); i++) {
                    //Debug.WriteLine(regs[i].description);
                    _Data.todo.Remove(regs[i]);
                    if (_Data.SaveChanges() > 0) {
                        result = new { state = true };
                    } else {
                        result = new { state = false };
                    }
                }

            } catch (Exception ex) {
                Debug.WriteLine(ex);
                return Json(result);
            }
            return Json(result);
        }

        [HttpPost]
        public JsonResult newPosition(int positionReg1, int idReg1, int positionReg2, int idReg2) {
            bool state = false;
            var result = new { state = state };

            var reg1 = _Data.todo.Find(idReg1);
            var reg2 = _Data.todo.Find(idReg2);

            try {
                if (reg1 != null) {
                    if (reg2 != null) {
                        reg1.position = positionReg2;
                        reg2.position = positionReg1;

                        _Data.Entry(reg1).State = EntityState.Modified;
                        _Data.Entry(reg2).State = EntityState.Modified;
                        if (_Data.SaveChanges() > 0) {
                            result = new { state = true };
                        } else {
                            result = new { state = false };
                        }

                    }
                }
            } catch (Exception ex) {
                Debug.WriteLine(ex);
            }


            return Json(result);
        }
    }
}
