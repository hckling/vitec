using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VitecArbetsprov.Model
{
    public class CustomerFilter
    {
        public string NameFilter { get; set; }
        public string SsnFilter { get; set; }
        public string CategoryFilter { get; set; }

        public bool IsEmpty()
        {
            return NameFilter.Length == 0 && SsnFilter.Length == 0 && CategoryFilter.Length == 0;
        }
    }
}
