using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Threading.Tasks;
using System.Xml.Serialization;

namespace VitecArbetsprov.Model
{
    [XmlType("Person")]
    public class Customer
    {
        [XmlElement("ID")]
        public int Id { get; set; }

        [XmlElement("Firstname")]
        public string FirstName { get; set; }

        [XmlElement("Lastname")]
        public string LastName { get; set; }

        [XmlElement("Socialnumber")]
        public string SocialSecurityNumber { get; set; }

        [XmlElement("PersonCategory")]
        public string Category { get; set; }

        public bool Matches(CustomerFilter filter)
        {
            var fullName = String.Format("{0} {1}", FirstName, LastName);

            return fullName.StartsWith(filter.NameFilter, StringComparison.InvariantCultureIgnoreCase) && 
                SocialSecurityNumber.StartsWith(filter.SsnFilter, StringComparison.InvariantCultureIgnoreCase) && 
                Category.StartsWith(filter.CategoryFilter, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
