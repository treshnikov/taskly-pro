using System.Collections.Concurrent;
using System.Linq.Expressions;

namespace Taskly.Application.Common.Specs;

internal static class LambdaCache<TIn, TOut>
{
	private static readonly ConcurrentDictionary<Expression<Func<TIn, TOut>>, Func<TIn, TOut>> _cache = new();

	public static Func<TIn, TOut> ToLambda(Expression<Func<TIn, TOut>> exp)
	{
		return _cache.GetOrAdd(exp, key => key.Compile());
	}
}
