using Lego.Domain;
using Ninject.Modules;
using Ninject;
using Lego.Module.HISDomain;
using Lego.Module.HISDomain.RepositoryInterfaces;
using Lego.Module.HISRepository;

namespace Lego.Module.HISWeb
{
      public class HISNinjectModule : NinjectModule, IModule
    {
        public int getId()
        {
            return 90;
        }

        public string getName()
        {
            return "HIS";
        }

        public string getVersion()
        {
            return "1.0.0";
        }

        public override void Load()
        {
            Kernel.Load("Lego.Module.HISRepository.dll");
            Bind<ISchedulingProgRepository>().To<SchedulingProgRepository>();
            Bind<ISchedulingProgManagementRepository>().To<SchedulingProgManagementRepository>();
        }
    }
}