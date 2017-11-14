using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Xml;
using System.Xml.Serialization;
using VitecArbetsprov.Model;

namespace VitecArbetsprov.Controllers
{
    public class CustomerController : Controller
    {
        private static List<Customer> _customers;
        private int _highestId = 0;

        // POST: Customer/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Create(IFormCollection collection)
        {
            try
            {
                Customer c = new Customer();

                c.FirstName = collection["FirstName"];
                c.LastName = collection["LastName"];
                c.Category = collection["Category"];
                c.SocialSecurityNumber = collection["SocialSecurityNumber"];

                _highestId++;

                c.Id = _highestId;

                return Ok();
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        // POST: Customer/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public ActionResult Edit(int id, IFormCollection collection)
        {
            try
            {
                // TODO: Add update logic here
                Customer customer = _customers.Find(c => c.Id == id);
                customer.FirstName = collection["FirstName"];
                customer.LastName = collection["LastName"];
                customer.Category = collection["Category"];
                customer.SocialSecurityNumber = collection["SocialSecurityNumber"];

                return RedirectToAction(nameof(Index));
            }
            catch
            {
                return View();
            }
        }

        // GET: Customer/Delete/5
        public ActionResult Delete(int id)
        {
            _customers.RemoveAll(c => c.Id == id);
            return Ok();            
        }

        [HttpGet]
        public ActionResult GetAll()
        {
            if (_customers == null)
            {
                ReadCustomers();
            }

            return new ObjectResult(_customers);
        }

        [HttpGet]
        public ActionResult GetPage(int resultsPerPage, int page)
        {
            if (_customers == null)
            {
                ReadCustomers();
            }

            return new ObjectResult(GetRange(_customers, page, resultsPerPage));
        }

        [HttpGet]
        public ActionResult GetPageFiltered(int resultsPerPage, int page, string filter)
        {
            if (_customers == null)
            {
                ReadCustomers();
            }

            if (filter.Length > 0)
            {
                var filteredCustomers = _customers.Where(c => c.Matches(filter)).ToList<Customer>();
                return new ObjectResult(GetRange(filteredCustomers, page, resultsPerPage));
            }
            else
            {
                return new ObjectResult(GetRange(_customers, page, resultsPerPage));
            }
        }

        private List<Customer> GetRange(List<Customer> customers, int page, int itemsPerPage)
        {
            var startIndex = Math.Min(page * itemsPerPage, customers.Count - 1);
            var length = Math.Min(itemsPerPage, customers.Count - 1 - startIndex);

            return customers.GetRange(startIndex, length);
        }

        private void ReadCustomers()
        {
            using (StreamReader reader = new StreamReader(".\\data\\personer.xml"))
            {
                var serializer = new XmlSerializer(typeof(List<Customer>), new XmlRootAttribute("ArrayOfPerson"));
                _customers = (List<Customer>)serializer.Deserialize(reader);
                _highestId = _customers.OrderByDescending(item => item.Id).First().Id;
            }
        }
    }
}