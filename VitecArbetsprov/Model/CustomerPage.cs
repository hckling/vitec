using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VitecArbetsprov.Model
{
    public class CustomerPage
    {
        public List<Customer> Customers { get; set; }
        public int PageNumber { get; set; }
        public int TotalPageCount { get; set; }
    }
}
