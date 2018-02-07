using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Senparc.Weixin.MP.Sample.Models
{
    public class KeyValue
    {
        private int vehid;
        public int Vehid
        {
            get { return vehid; }
            set { vehid = value; }
        }

        private string opendid;
        public string Opendid
        {
            get { return opendid; }
            set { opendid = value; }
        }

        private string cph;
        public string Cph
        {
            get { return cph; }
            set { cph = value; }
        }

        private int isSet;//默认值
        public int IsSet
        {
            get { return isSet; }
            set { isSet = value; }
        }


        private string groupName;
        public string GroupName
        {
            get { return groupName; }
            set { groupName = value; }
        }

        private string owner;
        public string Owner
        {
            get { return owner; }
            set { owner = value; }
        }

        private string ownerNo;
        public string OwnerNo
        {
            get { return ownerNo; }
            set { ownerNo = value; }
        }

        private string sim;
        public string Sim
        {
            get { return sim; }
            set { sim = value; }
        }


        private string time;
        public string Time
        {
            get { return time; }
            set { time = value; }
        }

        private string taxiNo;
        public string TaxiNo
        {
            get { return taxiNo; }
            set { taxiNo = value; }
        }


        private string psw;
        public string Psw
        {
            get { return psw; }
            set { psw = value; }
        }

        private string vehicleType;
        public string VehicleType
        {
            get { return vehicleType; }
            set { vehicleType = value; }
        }

        private string mark;
        public string Mark
        {
            get { return mark; }
            set { mark = value; }
        }
    }

    public class ViewModel
    {
        public int ID { get; set; }

        public string Name { get; set; }

        public List<KeyValue> Data { get; set; }
    }
}