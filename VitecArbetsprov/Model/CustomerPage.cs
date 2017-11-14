using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VitecArbetsprov.Model
{
    public class CustomerPage
    {
        public CustomerPage() { }

        public CustomerPage(List<Customer> list, int page, int totalPageCount)
        {
            Customers = list;
            PageNumber = page;
            TotalPageCount = totalPageCount;
        }

        public List<Customer> Customers { get; set; }
        public int PageNumber { get; set; }
        public int TotalPageCount { get; set; }
    }
}
