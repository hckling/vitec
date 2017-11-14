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
        private const string REPOSITORY_PATH = ".\\data\\personer.xml";
        private static List<Customer> _customers;
        private int _highestId = 0;

        public CustomerController()
        {
            if (_customers == null)
            {
                ReadCustomersFromFile();
            }
        }

        [HttpPost]
        public ActionResult Create([FromBody] Customer customer)
        {
            try
            {
                UpdateCustomerId(customer);

                _customers.Add(customer);

                return Ok();
            }
            catch
            {
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }

        private void UpdateCustomerId(Customer customer)
        {
            _highestId++;
            customer.Id = _highestId;
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

        [HttpGet]
        public ActionResult SaveChanges()
        {
            SaveCustomersToFile();

            return Ok();
        }

        private static void SaveCustomersToFile()
        {
            var serializer = new XmlSerializer(typeof(List<Customer>));

            System.IO.File.Delete(REPOSITORY_PATH);
            using (FileStream fs = new FileStream(REPOSITORY_PATH, FileMode.OpenOrCreate))
            {
                serializer.Serialize(fs, _customers);
            }
        }

        [HttpGet]
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

            customerPage.Customers = GetCustomersOnPage(_customers, page, resultsPerPage);
            customerPage.PageNumber = page;
            customerPage.TotalPageCount = CalculatePageCount(resultsPerPage);

            return new ObjectResult(customerPage);
        }

        [HttpGet]
        public ActionResult GetPageFiltered(int resultsPerPage, int page, string filter)
        {
            if (filter != null && filter.Length > 0)
            {
                var filteredCustomers = _customers.Where(c => c.Matches(filter)).ToList<Customer>();

                var filteredCustomersOnPage = GetCustomersOnPage(filteredCustomers, page, resultsPerPage);
                var totalNumberOfPages = (int) Math.Ceiling((float) filteredCustomers.Count / resultsPerPage);

                return new ObjectResult(new CustomerPage(filteredCustomersOnPage, page, totalNumberOfPages));
            }
            else
            {
                var customersOnPage = GetCustomersOnPage(_customers, page, resultsPerPage);
                var totalNumberOfPages = (int) Math.Ceiling((float)_customers.Count / resultsPerPage);

                return new ObjectResult(new CustomerPage(customersOnPage, page, totalNumberOfPages));
            }
        }

        private List<Customer> GetCustomersOnPage(List<Customer> customers, int page, int itemsPerPage)
        {
            var startIndex = Math.Max(Math.Min(page * itemsPerPage, customers.Count - 1), 0);
            var length = Math.Min(itemsPerPage, customers.Count - startIndex);

            return customers.GetRange(startIndex, length);
        }

        private void ReadCustomersFromFile()
        {
            using (StreamReader reader = new StreamReader(REPOSITORY_PATH))
            {
                var serializer = new XmlSerializer(typeof(List<Customer>), new XmlRootAttribute("ArrayOfPerson"));
                _customers = (List<Customer>)serializer.Deserialize(reader);
                _highestId = _customers.OrderByDescending(item => item.Id).First().Id;
            }
        }
    }
}