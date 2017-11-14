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

        public CustomerController()
        {
            if (_customers == null)
            {
                ReadCustomers();
            }
        }

        // POST: Customer/Create
        [HttpPost]
        public ActionResult Create([FromBody] Customer customer)
        {
            try
            {
                _highestId++;
                customer.Id = _highestId;

                _customers.Add(customer);

                return Ok();
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        public ActionResult CustomerCount()
        {
            return new ObjectResult(_customers.Count);
        }

        [HttpGet]
        public ActionResult PageCount(int resultsPerPage)
        {
            return new ObjectResult(CalculatePageCount(resultsPerPage));
        }

        private int CalculatePageCount(int resultsPerPage)
        {
            if (resultsPerPage > 1)
            {
                return (int) Math.Ceiling((double)(_customers.Count / resultsPerPage));
            }
            else
            {
                return _customers.Count;
            }
        }

        public ActionResult SaveChanges()
        {
            // TODO: Write to file
            return Ok();
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
            return new ObjectResult(_customers);
        }

        [HttpGet]
        public ActionResult GetPage(int resultsPerPage, int page)
        {
            CustomerPage customerPage = new CustomerPage();

            customerPage.Customers = GetRange(_customers, page, resultsPerPage);
            customerPage.PageNumber = page;
            customerPage.TotalPageCount = CalculatePageCount(resultsPerPage);

            return new ObjectResult(customerPage);
        }

        [HttpGet]
        public ActionResult GetPageFiltered(int resultsPerPage, int page, string filter)
        {
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
            var startIndex = Math.Max(Math.Min(page * itemsPerPage, customers.Count - 1), 0);
            var length = Math.Min(itemsPerPage, customers.Count - startIndex);

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